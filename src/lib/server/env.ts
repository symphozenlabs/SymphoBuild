import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import { z } from 'zod';

/** Treat empty strings in .env files as "not set". */
const optional = <T extends z.ZodType>(schema: T) =>
	z.preprocess(
		(v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
		schema.optional()
	);

const EnvSchema = z.object({
	PUBLIC_SANITY_PROJECT_ID: optional(
		z.string().regex(/^[a-z0-9-]+$/, 'Sanity project IDs contain only a–z, 0–9 and dashes')
	),
	PUBLIC_SANITY_DATASET: optional(z.string().regex(/^[a-z0-9_-]+$/)).transform(
		(v) => v ?? 'production'
	),
	PUBLIC_SANITY_API_VERSION: optional(
		z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use a YYYY-MM-DD API version')
	).transform((v) => v ?? '2025-09-01'),
	PUBLIC_SITE_URL: optional(z.url()).transform((v) =>
		(v ?? 'http://localhost:5173').replace(/\/$/, '')
	),
	SANITY_API_READ_TOKEN: optional(z.string().min(20)),
	SANITY_API_WRITE_TOKEN: optional(z.string().min(20)),
	LEAD_NOTIFY_WEBHOOK_URL: optional(z.url()),
	/** Instagram API (Instagram Login) long-lived token; turns on the footer site journal. */
	INSTAGRAM_ACCESS_TOKEN: optional(z.string().min(20)),
	/** Set by Vercel; authenticates its cron calls (Instagram token refresh). */
	CRON_SECRET: optional(z.string().min(16))
});

export type ServerEnv = z.infer<typeof EnvSchema>;

let cached: ServerEnv | undefined;

/** Validated environment. Throws a readable error at first use if misconfigured. */
export function getEnv(): ServerEnv {
	if (cached) return cached;
	const parsed = EnvSchema.safeParse({ ...publicEnv, ...privateEnv });
	if (!parsed.success) {
		const issues = parsed.error.issues
			.map((i) => `  • ${i.path.join('.')}: ${i.message}`)
			.join('\n');
		throw new Error(`Invalid environment configuration:\n${issues}\nSee .env.example.`);
	}
	cached = parsed.data;
	return cached;
}

/** Demo mode = no Sanity project configured; content is served from the local seed dataset. */
export const isDemoMode = () => !getEnv().PUBLIC_SANITY_PROJECT_ID;
