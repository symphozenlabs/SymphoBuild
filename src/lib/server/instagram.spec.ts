import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { demoInstagramFeed } from './demo/instagram';
import { getInstagramFeed, instagramEnabled, setInstagramSettings } from './instagram';

/** Settings for each test: a token, no Sanity (so it is used as set), production behaviour. */
const settings = { token: undefined as string | undefined, samples: false };

const TOKEN = 'IGAA-test-token-0123456789';
let cursor = 0;
/** The module caches pages per cursor; a fresh cursor keeps each test independent. */
const fresh = () => `t${++cursor}`;

const media = (overrides: Record<string, unknown>) => ({
	id: '1',
	media_type: 'IMAGE',
	media_url: 'https://cdn.example/1.jpg',
	permalink: 'https://www.instagram.com/p/1/',
	timestamp: '2026-11-20T10:00:00+0000',
	...overrides
});

/** Stand-in for graph.instagram.com: `page` for /me/media, a fixed profile for /me. */
function mockInstagram(page: unknown, status = 200) {
	const fetchMock = vi.fn(async (url: string) => {
		const isMedia = url.includes('/me/media');
		const body = isMedia
			? page
			: { username: 'spacecraft_associates', media_count: 42, followers_count: 1200 };
		return new Response(JSON.stringify(body), { status: isMedia ? status : 200 });
	});
	vi.stubGlobal('fetch', fetchMock);
	return fetchMock;
}

beforeEach(() => {
	settings.token = TOKEN;
	settings.samples = false;
	setInstagramSettings({
		seedToken: () => settings.token,
		samples: () => settings.samples,
		client: () => null
	});
});
afterEach(() => {
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});

test('maps photos, reels and albums and passes the next cursor on', async () => {
	mockInstagram({
		data: [
			media({ id: 'a', caption: '  Slab poured  ' }),
			media({
				id: 'b',
				media_type: 'VIDEO',
				media_url: 'https://cdn.example/b.mp4',
				thumbnail_url: 'https://cdn.example/b.jpg'
			}),
			media({ id: 'c', media_type: 'CAROUSEL_ALBUM' }),
			media({ id: 'd', media_type: 'VIDEO', media_url: undefined, thumbnail_url: undefined }),
			{ id: 'broken' }
		],
		paging: { cursors: { after: 'NEXT' }, next: 'https://graph.instagram.com/next' }
	});
	const feed = await getInstagramFeed({ after: fresh(), limit: 9 });
	expect(feed.status).toBe('ok');
	expect(feed.posts.map((p) => [p.id, p.kind])).toEqual([
		['a', 'image'],
		['b', 'video'],
		['c', 'album']
	]);
	expect(feed.posts[0].caption).toBe('Slab poured');
	expect(feed.posts[1]).toMatchObject({
		image: 'https://cdn.example/b.jpg',
		video: 'https://cdn.example/b.mp4'
	});
	expect(feed.next).toBe('NEXT');
});

test('reads the profile for the first page only', async () => {
	const fetchMock = mockInstagram({ data: [media({})] });
	const first = await getInstagramFeed({ limit: 9 });
	expect(first.profile).toMatchObject({ username: 'spacecraft_associates', posts: 42 });
	expect(first.next).toBeNull();
	fetchMock.mockClear();
	const later = await getInstagramFeed({ after: fresh(), limit: 12 });
	expect(later.profile).toBeNull();
	expect(fetchMock).toHaveBeenCalledTimes(1);
});

test('reports Instagram errors without ever logging the token', async () => {
	const log = vi.spyOn(console, 'error').mockImplementation(() => {});
	mockInstagram({ error: { message: 'Invalid OAuth access token' } }, 400);
	const feed = await getInstagramFeed({ after: fresh(), limit: 9 });
	expect(feed).toMatchObject({ status: 'error', posts: [] });
	expect(log).toHaveBeenCalled();
	expect(JSON.stringify(log.mock.calls)).not.toContain(TOKEN);
});

test('is off without a token, except where sample posts are allowed', async () => {
	settings.token = undefined;
	expect(instagramEnabled()).toBe(false);
	expect((await getInstagramFeed({ after: fresh(), limit: 9 })).status).toBe('unconfigured');
	settings.samples = true;
	expect(instagramEnabled()).toBe(true);
	expect((await getInstagramFeed({ after: fresh(), limit: 9 })).status).toBe('demo');
});

test('the demo feed pages through its sample posts', () => {
	const first = demoInstagramFeed({ limit: 9 });
	expect(first.posts).toHaveLength(9);
	expect(first.profile?.username).toBe('spacecraft_associates');
	const second = demoInstagramFeed({ after: first.next!, limit: 12 });
	expect(second.posts).toHaveLength(12);
	expect(second.next).toBeNull();
	expect(new Set([...first.posts, ...second.posts].map((p) => p.id)).size).toBe(21);
});
