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
	poster: '/hero/hero-poster.jpg'
} as const;

const FPS = 24;
/** Segment boundaries (frame numbers); must match CUTS in assets-src/hero-video/segments.sh. */
const CUTS = [0, 110, 223, 379, 494, 597, 696, 844];

/**
 * The film in stage-aligned pieces (keyframe every 16 frames). Each is downloaded on its own,
 * in order, so the first stages scrub within seconds; later pieces arrive while the visitor
 * reads the first stages.
 */
export const SEGMENTS = CUTS.slice(0, -1).map((from, i) => ({
	start: from / FPS,
	end: CUTS[i + 1] / FPS
}));

/**
 * The film in four encodes (static/hero/film/<id>/<n>.mp4, made by segments.sh), all visually
 * identical at the size they are shown (VMAF ≈ 97+ against the master). Each visitor gets the
 * smallest one their screen and browser can use: 720p where the film is drawn no wider than a
 * phone shows it (about a third of the 1080p bytes with AV1), and AV1 only where the device
 * decodes it in hardware (28–32% smaller than H.264), else H.264, which plays everywhere.
 * Software AV1 decodes fine for playback but takes 5–8× longer per seek than H.264 (measured:
 * ~340 ms vs ~70 ms per frame step at 1080p), which would make scrubbing visibly choppy.
 */
export const VARIANTS = [
	{ id: '720-av1', height: 720, type: 'video/mp4; codecs="av01.0.05M.08"', mbps: 4.5 },
	{ id: '720-avc', height: 720, type: 'video/mp4; codecs="avc1.640028"', mbps: 6.5 },
	{ id: '1080-av1', height: 1080, type: 'video/mp4; codecs="av01.0.08M.08"', mbps: 11 },
	{ id: '1080-avc', height: 1080, type: 'video/mp4; codecs="avc1.640032"', mbps: 14 }
] as const;
export type FilmVariant = (typeof VARIANTS)[number]['id'];

export const segmentSrc = (variant: FilmVariant, index: number) =>
	`/hero/film/${variant}/${index + 1}.mp4?v=${VERSION}`;

/** Widest the film is drawn, in device pixels, at which 720p still looks as sharp as 1080p. */
const MAX_720_WIDTH = 1400;

/**
 * The resolution to use for a screen. Landscape screens show the film full-bleed (cover), so
 * it is drawn at least as wide as the viewport and as wide as 16:9 of its height; portrait
 * screens letterbox it to the viewport width.
 */
export function filmHeightFor(screen: {
	width: number;
	height: number;
	dpr: number;
	landscape: boolean;
}): 720 | 1080 {
	const drawn = screen.landscape ? Math.max(screen.width, (screen.height * 16) / 9) : screen.width;
	return drawn * screen.dpr <= MAX_720_WIDTH ? 720 : 1080;
}

/** The version for this visitor (browser only). */
export async function pickFilmVariant(): Promise<FilmVariant> {
	const height = filmHeightFor({
		width: window.innerWidth,
		height: window.innerHeight,
		dpr: window.devicePixelRatio || 1,
		landscape: window.matchMedia('(min-aspect-ratio: 5/4)').matches
	});
	const [av1, avc] = VARIANTS.filter((v) => v.height === height);
	return (await decodesInHardware(av1)) ? av1.id : avc.id;
}

async function decodesInHardware(variant: (typeof VARIANTS)[number]): Promise<boolean> {
	if (!document.createElement('video').canPlayType(variant.type)) return false;
	try {
		const info = await navigator.mediaCapabilities.decodingInfo({
			type: 'file',
			video: {
				contentType: variant.type,
				width: (variant.height * 16) / 9,
				height: variant.height,
				framerate: 24,
				bitrate: variant.mbps * 1_000_000
			}
		});
		// powerEfficient means a hardware decoder: fast seeks, and no drain on phone batteries.
		return info.supported && info.smooth && info.powerEfficient;
	} catch {
		return false;
	}
}

/** Index of the segment that holds a film time. */
export function segmentAt(time: number): number {
	for (let i = SEGMENTS.length - 1; i > 0; i--) if (time >= SEGMENTS[i].start) return i;
	return 0;
}

/** Time within its segment for a film time, clamped to the segment's last frame. */
export function segmentTime(time: number, index: number): number {
	const { start, end } = SEGMENTS[index];
	return Math.min(Math.max(time - start, 0), end - start - 1 / (2 * FPS));
}

/** Download order: the segment needed now first, then onwards, then any earlier ones. */
export function loadOrder(time: number): number[] {
	const first = segmentAt(time);
	const all = SEGMENTS.map((_, i) => i);
	return [...all.slice(first), ...all.slice(0, first).reverse()];
}

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

export type FilmWindow = readonly [number, number];

/**
 * Film windows for the process steps, in order. Each step starts where its stage starts in
 * STAGE_WINDOWS and runs until the next step begins, so the film plays continuously even when
 * Sanity leaves a stage out (e.g. no Aftercare step: Finishes plays on through the blue-hour
 * reveal instead of the film jumping to the handover). The first step picks up where the hero
 * leaves off. Steps without a known stage, or in an order that would run the film backwards,
 * share the film evenly. When a separate "foundation" step exists, "structure" starts after it.
 */
export function stepWindows(stages: readonly (string | undefined)[]): FilmWindow[] {
	const n = stages.length;
	if (!n) return [];
	const even = (i: number) => HERO_SPAN + (i * (FILM.duration - HERO_SPAN)) / n;
	const hasFoundation = stages.includes('foundation');
	const known = (s: string | undefined) => (s && STAGE_WINDOWS[s] ? STAGE_WINDOWS[s] : undefined);
	let starts = stages.map((s, i) =>
		s === 'structure' && hasFoundation ? STAGE_WINDOWS.foundation[1] : (known(s)?.[0] ?? even(i))
	);
	const ordered = starts.every((t, i) => i === 0 || t > starts[i - 1]);
	if (!ordered) starts = stages.map((_, i) => even(i));
	starts[0] = HERO_SPAN;
	// The last step ends where its own stage ends (Finishes stops before the reveal), or at
	// the end of the film.
	const last = (ordered && known(stages[n - 1])?.[1]) || FILM.duration;
	return starts.map((a, i) => [a, i + 1 < n ? starts[i + 1] : Math.max(last, a)]);
}

/** Film time (seconds) for the current scroll position. */
export function filmTime(opts: {
	heroProgress: number;
	index: number;
	frac: number;
	windows: readonly FilmWindow[];
}): number {
	const win = opts.windows[opts.index];
	if (opts.index < 0 || !win) return clamp01(opts.heroProgress) * HERO_SPAN;
	const [a, b] = win;
	return a + (b - a) * clamp01(opts.frac);
}

/** The still closest to a film time. */
export function stillAt(time: number): string {
	let best: (typeof STILLS)[number] = STILLS[0];
	for (const s of STILLS) if (Math.abs(s.at - time) < Math.abs(best.at - time)) best = s;
	return best.src;
}
