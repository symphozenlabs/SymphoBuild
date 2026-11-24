import { getEnv, isDemoMode } from '$lib/server/env';
import { instagramEnabled } from '$lib/server/instagram';
import { LAYOUT_QUERY } from '$lib/server/queries';
import { sanityFetch } from '$lib/server/sanity';
import type { LayoutData } from '$lib/types';

export const load = async () => {
	const data = await sanityFetch<LayoutData>(LAYOUT_QUERY);
	return {
		...data,
		settings: data.settings ?? { siteName: 'Spacecraft Associates' },
		siteUrl: getEnv().PUBLIC_SITE_URL,
		demoMode: isDemoMode(),
		/** The footer site journal loads its posts in the browser, only when this is set. */
		instagram: instagramEnabled()
	};
};
