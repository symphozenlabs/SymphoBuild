/**
 * Timeline of the home-page construction film (static/hero, generated with Higgsfield and
 * upscaled to 1080p). Drawings on the site table → plot marked out → excavation and frame →
 * envelope → finishes → blue-hour reveal (aftercare) → the keys handed to the homeowners
 * (handover). Scrolling through the process steps scrubs it; each step's `stage` (set in
 * Sanity) picks its window below.
 */

/** Bump when the film files are re-encoded so browsers and CDNs fetch the new versions. */
const VERSION = '2026-11-07';

export const FILM = {
	duration: 35.166,
	width: 1920,
	height: 1080,
	poster: '/hero/hero-poster.jpg',
	/** Scrub-optimised 1080p encode (keyframe every 8 frames, no B-frames, no audio). */
	src: `/hero/hero-scrub-1080.mp4?v=${VERSION}`
} as const;

/** Seconds of film that play while the hero itself scrolls away. */
export const HERO_SPAN = 1.2;

/** Film window (seconds) for each Sanity process stage. */
export const STAGE_WINDOWS: Record<string, readonly [number, number]> = {
	design: [HERO_SPAN, 4.6], // drawings on the site table
	approvals: [4.6, 9.3], // camera rises to the marked-out plot
	foundation: [9.3, 12.2], // excavation and raft
	structure: [9.3, 15.8], // raft → full concrete frame (includes foundation unless that has its own step)
	envelope: [15.8, 20.6], // blockwork, glazing, terracotta fins
	finishes: [20.6, 24.9], // crane down, landscape, lights on
	aftercare: [24.9, 29.0], // blue-hour pull-back over the finished tower
	handover: [29.0, FILM.duration] // keys handed to the homeowners at the entrance
};

/** Stills taken from the film, used for reduced motion / data saver instead of scrubbing. */
export const STILLS = [
	{ src: '/hero/stage-0.jpg', at: 0.5 },
	{ src: '/hero/stage-1.jpg', at: 4.3 },
	{ src: '/hero/stage-2.jpg', at: 9.0 },
	{ src: '/hero/stage-3.jpg', at: 15.5 },
	{ src: '/hero/stage-4.jpg', at: 20.3 },
	{ src: '/hero/stage-5.jpg', at: 24.6 },
	{ src: '/hero/stage-6.jpg', at: 28.7 },
	{ src: '/hero/stage-7.jpg', at: 35.0 }
] as const;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * The film window for a step. Known stages use STAGE_WINDOWS; steps without a stage share
 * the film evenly. When a separate "foundation" step exists, "structure" starts after it so
 * scrolling never runs the film backwards.
 */
export function stageWindow(
	stage: string | undefined,
	index: number,
	count: number,
	hasFoundation = false
): readonly [number, number] {
	if (stage === 'structure' && hasFoundation) return [STAGE_WINDOWS.foundation[1], 15.8];
	if (stage && STAGE_WINDOWS[stage]) return STAGE_WINDOWS[stage];
	const span = (FILM.duration - HERO_SPAN) / Math.max(count, 1);
	return [HERO_SPAN + index * span, HERO_SPAN + (index + 1) * span];
}

/** Film time (seconds) for the current scroll position. */
export function filmTime(opts: {
	heroProgress: number;
	index: number;
	frac: number;
	stage?: string;
	count: number;
	hasFoundation?: boolean;
}): number {
	if (opts.index < 0) return clamp01(opts.heroProgress) * HERO_SPAN;
	const [a, b] = stageWindow(opts.stage, opts.index, opts.count, opts.hasFoundation);
	return a + (b - a) * clamp01(opts.frac);
}

/** The still closest to a film time. */
export function stillAt(time: number): string {
	let best: (typeof STILLS)[number] = STILLS[0];
	for (const s of STILLS) if (Math.abs(s.at - time) < Math.abs(best.at - time)) best = s;
	return best.src;
}
