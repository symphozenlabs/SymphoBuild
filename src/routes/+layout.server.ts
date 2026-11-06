import { getEnv, isDemoMode } from '$lib/server/env';
import { LAYOUT_QUERY } from '$lib/server/queries';
import { sanityFetch } from '$lib/server/sanity';
import type { LayoutData } from '$lib/types';

export const load = async () => {
	const data = await sanityFetch<LayoutData>(LAYOUT_QUERY);
	return {
		...data,
		settings: data.settings ?? { siteName: 'Spacecraft Associates' },
		siteUrl: getEnv().PUBLIC_SITE_URL,
		demoMode: isDemoMode()
	};
};
