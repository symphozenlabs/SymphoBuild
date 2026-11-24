/**
 * Sample Instagram posts, built from the bundled demo photography, so the footer site journal
 * can be previewed in demo mode and local development before the account is connected. Never
 * used once INSTAGRAM_ACCESS_TOKEN is set, nor in a production build without one.
 */
import type { InstagramFeed, InstagramPost } from '$lib/types';

const SAMPLES: [image: string, kind: InstagramPost['kind'], caption: string][] = [
	[
		'hero_tower',
		'image',
		'Blue hour at the tower — every light on for the first time. #SiteJournal'
	],
	[
		'palm_grid',
		'album',
		'Palm Grid Enclave, plot by plot: the avenue is in, the first homes rise.'
	],
	[
		'interior_kitchen',
		'image',
		'Quartz, oak and a window over the garden. Kitchen sign-off today.'
	],
	['meridian_works', 'video', 'Meridian Works from the crane: 40 seconds of a slab pour.'],
	['lakeline_pool', 'image', 'Lakeline: the pool deck is tiled and the water is in.'],
	['landscape_garden', 'image', 'Native planting only — 32 species, all from local nurseries.'],
	['interior_living', 'album', 'Show home living room, staged for the weekend walkthroughs.'],
	['meridian_lobby', 'image', 'Terrazzo poured in place and polished in three passes.'],
	['northfield', 'image', 'Northfield, before and after: from survey pegs to a finished street.'],
	['amenity_clubhouse', 'video', 'Clubhouse handover walk with the residents association.'],
	['ivory_row', 'image', 'Ivory Row facade mock-up approved — lime plaster, hand-trowelled.'],
	['lakeline', 'image', 'Morning light across Lakeline, two weeks before handover.'],
	['office', 'image', 'Design review on a Monday. Every drawing is checked twice.'],
	['palm_grid_avenue', 'image', 'The avenue at Palm Grid, planted two seasons ago.']
];

const POSTS: InstagramPost[] = Array.from({ length: 21 }, (_, i) => {
	const [image, kind, caption] = SAMPLES[i % SAMPLES.length];
	return {
		id: `demo-${i + 1}`,
		kind,
		image: `/demo/${image}-800.jpg`,
		caption,
		permalink: 'https://www.instagram.com/spacecraft_associates/',
		timestamp: new Date(Date.UTC(2026, 10, 20) - i * 3.5 * 86_400_000).toISOString()
	};
});

export function demoInstagramFeed({
	after,
	limit
}: {
	after?: string;
	limit: number;
}): InstagramFeed {
	const from = Number(after) || 0;
	const posts = POSTS.slice(from, from + limit);
	return {
		status: 'demo',
		profile: after
			? null
			: {
					username: 'spacecraft_associates',
					name: 'Spacecraft Associates',
					posts: 128,
					followers: 2460
				},
		posts,
		next: from + limit < POSTS.length ? String(from + limit) : null
	};
}
