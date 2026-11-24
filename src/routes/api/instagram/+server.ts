import { error, json } from '@sveltejs/kit';
import { getInstagramFeed } from '$lib/server/instagram';

/**
 * GET /api/instagram?limit=9&after=<cursor> — one page of the footer site journal. Cached at
 * the edge for 15 minutes (and served stale for a day while it refreshes), so Instagram is
 * asked at most a few times an hour however busy the site is.
 */
export const GET = async ({ url, setHeaders }) => {
	const after = url.searchParams.get('after') ?? undefined;
	if (after !== undefined && !/^[\w=-]{1,400}$/.test(after)) error(400, 'Invalid cursor');
	const limit = Math.min(24, Math.max(1, Number(url.searchParams.get('limit')) || 9));

	const feed = await getInstagramFeed({ after, limit });
	setHeaders({
		'cache-control':
			feed.status === 'ok' || feed.status === 'demo'
				? 'public, max-age=300, s-maxage=900, stale-while-revalidate=86400'
				: 'no-store'
	});
	return json(feed);
};
