import { error, json } from '@sveltejs/kit';
import { getEnv } from '$lib/server/env';
import { renewInstagramToken } from '$lib/server/instagram';

/**
 * GET /api/instagram/refresh — renews the Instagram token. Called daily by Vercel Cron
 * (vercel.json) as a safety net; the feed also renews it on its own when due.
 */
export const GET = async ({ request }) => {
	const secret = getEnv().CRON_SECRET;
	const authorised = secret
		? request.headers.get('authorization') === `Bearer ${secret}`
		: (request.headers.get('user-agent') ?? '').startsWith('vercel-cron/');
	if (!authorised) error(401, 'Unauthorised');
	return json(
		{ status: await renewInstagramToken() },
		{ headers: { 'cache-control': 'no-store' } }
	);
};
