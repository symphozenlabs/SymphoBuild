/**
 * Instagram feed for the footer "site journal", read from the client's professional account
 * through the Instagram API with Instagram Login (graph.instagram.com).
 *
 * Token lifecycle: the long-lived token (60 days) is set once as INSTAGRAM_ACCESS_TOKEN.
 * The site renews it weekly and keeps the renewed token in a private Sanity document
 * (`secrets.instagram`: documents with a dot in their ID are never publicly readable), so
 * the feed keeps working without anyone touching it. Setting a new INSTAGRAM_ACCESS_TOKEN
 * (e.g. after reconnecting the account) replaces the stored one.
 */
import { createHash } from 'node:crypto';
import { dev } from '$app/environment';
import type { SanityClient } from '@sanity/client';
import { z } from 'zod';
import type { InstagramFeed, InstagramPost } from '$lib/types';
import { getEnv, isDemoMode } from './env';
import { getWriteClient } from './sanity';

const GRAPH = 'https://graph.instagram.com';
const SECRET_ID = 'secrets.instagram';
const HOUR = 3_600_000;
const DAY = 24 * HOUR;
/** Renew weekly; tokens last 60 days and must be at least a day old to renew. */
const REFRESH_AFTER = 7 * DAY;
/** After a failed renewal, wait before trying again. */
const RETRY_AFTER = 6 * HOUR;
/** Per-instance cache; the API route adds a CDN cache on top. */
const CACHE_TTL = 10 * 60_000;

type Secret = {
	_id: string;
	_type: 'instagramToken';
	token: string;
	/** Fingerprint of the INSTAGRAM_ACCESS_TOKEN this token descends from. */
	seed: string;
	refreshedAt: number;
	expiresAt?: number;
	attemptAt?: number;
};

const MediaSchema = z.object({
	id: z.string(),
	caption: z.string().optional(),
	media_type: z.enum(['IMAGE', 'VIDEO', 'CAROUSEL_ALBUM']),
	media_url: z.string().url().optional(),
	thumbnail_url: z.string().url().optional(),
	permalink: z.string().url(),
	timestamp: z.string()
});
const MediaPageSchema = z.object({
	data: z.array(z.unknown()),
	paging: z
		.object({
			cursors: z.object({ after: z.string().optional() }).optional(),
			next: z.string().optional()
		})
		.optional()
});
const ProfileSchema = z.object({
	username: z.string(),
	name: z.string().optional(),
	profile_picture_url: z.string().url().optional(),
	followers_count: z.number().optional(),
	media_count: z.number().optional()
});
const RefreshSchema = z.object({ access_token: z.string().min(20), expires_in: z.number() });

const fingerprint = (token: string) =>
	createHash('sha256').update(token).digest('hex').slice(0, 16);
const reason = (err: unknown) => (err instanceof Error ? err.message : String(err));

/** GET a Graph API path. Errors carry Instagram's message, never the token. */
async function graph(path: string, params: Record<string, string>): Promise<unknown> {
	const res = await fetch(`${GRAPH}${path}?${new URLSearchParams(params)}`, {
		signal: AbortSignal.timeout(8000)
	});
	const body = (await res.json().catch(() => null)) as { error?: { message?: string } } | null;
	if (!res.ok)
		throw new Error(`Instagram ${res.status}: ${body?.error?.message ?? 'request failed'}`);
	return body;
}

async function renew(client: SanityClient, secret: Secret): Promise<Secret> {
	const now = Date.now();
	try {
		const body = RefreshSchema.parse(
			await graph('/refresh_access_token', {
				grant_type: 'ig_refresh_token',
				access_token: secret.token
			})
		);
		const next: Secret = {
			...secret,
			token: body.access_token,
			refreshedAt: now,
			expiresAt: now + body.expires_in * 1000,
			attemptAt: now
		};
		await client.createOrReplace(next);
		return next;
	} catch (err) {
		console.warn('[instagram] token renewal failed:', reason(err));
		await client
			.patch(SECRET_ID)
			.set({ attemptAt: now })
			.commit()
			.catch(() => {});
		return { ...secret, attemptAt: now };
	}
}

/** The current access token, renewing it when due. Null when Instagram is not set up. */
async function getToken(force = false): Promise<string | null> {
	const seedToken = settings.seedToken();
	if (!seedToken) return null;
	const client = settings.client();
	if (!client) return seedToken; // no write access: use the token as set (it expires in 60 days)
	const seed = fingerprint(seedToken);
	let secret: Secret | undefined = await client
		.getDocument<Secret>(SECRET_ID)
		.then((doc) => doc as Secret | undefined)
		.catch(() => undefined);
	if (!secret?.token || secret.seed !== seed) {
		secret = { _id: SECRET_ID, _type: 'instagramToken', token: seedToken, seed, refreshedAt: 0 };
		await client.createOrReplace(secret).catch((err) => {
			console.warn('[instagram] could not store the token:', reason(err));
		});
	}
	const now = Date.now();
	const due =
		now - secret.refreshedAt > REFRESH_AFTER && now - (secret.attemptAt ?? 0) > RETRY_AFTER;
	if (force || due) secret = await renew(client, secret);
	return secret.token;
}

/** Renew the token now (daily Vercel cron). */
export async function renewInstagramToken(): Promise<'renewed' | 'unconfigured'> {
	return (await getToken(true)) ? 'renewed' : 'unconfigured';
}

function toPost(raw: unknown): InstagramPost | null {
	const parsed = MediaSchema.safeParse(raw);
	if (!parsed.success) return null;
	const m = parsed.data;
	const video = m.media_type === 'VIDEO';
	const image = video ? m.thumbnail_url : m.media_url;
	if (!image) return null;
	return {
		id: m.id,
		kind: video ? 'video' : m.media_type === 'CAROUSEL_ALBUM' ? 'album' : 'image',
		image,
		video: video ? m.media_url : undefined,
		caption: m.caption?.trim() ?? '',
		permalink: m.permalink,
		timestamp: m.timestamp
	};
}

const cache = new Map<string, { at: number; feed: InstagramFeed }>();

type Settings = {
	/** INSTAGRAM_ACCESS_TOKEN, the token the stored one descends from. */
	seedToken: () => string | undefined;
	/**
	 * Without a token, sample posts stand in for the feed in demo mode and in local development
	 * (`npm run dev`), so the journal can be previewed before the account is connected. A
	 * production build without a token hides the journal instead.
	 */
	samples: () => boolean;
	/** Sanity client that stores the renewed token; null when there is no write token. */
	client: () => SanityClient | null;
};
const LIVE: Settings = {
	seedToken: () => getEnv().INSTAGRAM_ACCESS_TOKEN,
	samples: () => isDemoMode() || dev,
	client: getWriteClient
};
let settings = LIVE;

/** Tests only: run against fixed settings instead of the environment (and clear the cache). */
export function setInstagramSettings(overrides: Partial<Settings> = {}) {
	settings = { ...LIVE, ...overrides };
	cache.clear();
}

/** One page of the feed: the latest posts, or the page after `after`. */
export async function getInstagramFeed(opts: {
	after?: string;
	limit: number;
}): Promise<InstagramFeed> {
	const key = `${opts.after ?? ''}:${opts.limit}`;
	const hit = cache.get(key);
	if (hit && Date.now() - hit.at < CACHE_TTL) return hit.feed;

	try {
		const token = await getToken();
		if (!token) {
			if (!settings.samples())
				return { status: 'unconfigured', profile: null, posts: [], next: null };
			const { demoInstagramFeed } = await import('./demo/instagram');
			return demoInstagramFeed(opts);
		}
		const params: Record<string, string> = {
			fields: 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp',
			limit: String(opts.limit),
			access_token: token
		};
		if (opts.after) params.after = opts.after;
		const [page, profile] = await Promise.all([
			graph('/me/media', params).then((b) => MediaPageSchema.parse(b)),
			// The profile only heads the first page.
			opts.after
				? null
				: graph('/me', {
						fields: 'username,name,profile_picture_url,followers_count,media_count',
						access_token: token
					})
						.then((b) => ProfileSchema.parse(b))
						.catch((err) => {
							console.warn('[instagram] profile unavailable:', reason(err));
							return null;
						})
		]);
		const feed: InstagramFeed = {
			status: 'ok',
			profile: profile && {
				username: profile.username,
				name: profile.name,
				avatar: profile.profile_picture_url,
				followers: profile.followers_count,
				posts: profile.media_count
			},
			posts: page.data.map(toPost).filter((p): p is InstagramPost => !!p),
			next: page.paging?.next ? (page.paging.cursors?.after ?? null) : null
		};
		cache.set(key, { at: Date.now(), feed });
		return feed;
	} catch (err) {
		console.error('[instagram] feed unavailable:', reason(err));
		// Serve the last good copy rather than an empty journal.
		if (hit) return hit.feed;
		return { status: 'error', profile: null, posts: [], next: null };
	}
}

/** Whether the footer should show the journal at all. */
export const instagramEnabled = () => !!settings.seedToken() || settings.samples();
