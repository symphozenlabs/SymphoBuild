<!--
	Home hero + "From drawing board to door key" process timeline, sharing one sticky stage.
	Scrolling through the Sanity-managed process steps scrubs a photoreal construction film
	(static/hero, 1080p; timeline in $lib/hero-film): site drawings → marked-out plot → frame →
	envelope → finishes → blue-hour reveal → keys handed to the homeowners.

	Progressive layers:
	  1. SSR / no-JS          → hero + steps in normal flow over the film's first frame
	  2. Reduced motion /
	     data saver           → a still from the film per step, cross-faded (no scrubbing)
	  3. Default              → the film downloads after first paint in stage-sized segments and is
	                            scrubbed by scroll; a segment still on its way shows its stage still
	Landscape screens show the film full-bleed; portrait phones show it letterboxed at the top
	of the screen, above the docked step card.
-->
<script lang="ts">
	import ArrowDown from '@lucide/svelte/icons/arrow-down';
	import { onMount } from 'svelte';
	import type { HomePage } from '$lib/types';
	import { cx } from '$lib/utils';
	import {
		FILM,
		SEGMENTS,
		filmTime,
		loadOrder,
		segmentAt,
		segmentTime,
		stepWindows,
		stillAt
	} from '$lib/hero-film';
	import { prefersReducedMotion, reveal } from '$lib/motion/actions';
	import CtaButton from '$lib/components/ui/CtaButton.svelte';
	import SplitText from '$lib/components/ui/SplitText.svelte';
	import Img from '$lib/components/ui/Img.svelte';

	let { hero, process }: { hero: HomePage['hero']; process: HomePage['process'] } = $props();

	const steps = $derived(process?.steps ?? []);
	// "scene" is the stored value for the construction film (it used to be a 3D scene).
	const mode = $derived(hero?.mediaMode ?? 'scene');

	let section: HTMLElement | undefined = $state();
	let heroEl: HTMLElement | undefined = $state();
	let videos: HTMLVideoElement[] = $state([]);
	let posterEl: HTMLImageElement | undefined = $state();
	let introEl: HTMLDivElement | undefined = $state();
	let stepEls: HTMLElement[] = $state([]);
	let active = $state(-1);
	let heroProgress = $state(0);
	/** Set when the film is skipped (reduced motion, data saver). */
	let stillMode = $state(false);
	/** Still for the active step: the whole story in still mode, and the stand-in while the
	 *  part of the film the visitor has scrolled to is still downloading. */
	let still = $state<string>(FILM.poster);
	/** Film segment on screen (-1 = none yet, the poster shows). */
	let current = $state(-1);
	/** The segment the scroll position needs has not downloaded yet. */
	let waiting = $state(false);
	const showStill = $derived(stillMode || (waiting && active >= 0));
	/** The still on screen has loaded. Until then the frame underneath stays visible, so the
	 *  stage is never blank while a still downloads. */
	let stillLoaded = $state(false);
	const stillCovers = $derived(showStill && stillLoaded);

	onMount(() => {
		if (!section || !heroEl || mode !== 'scene') return;
		const windows = stepWindows(steps.map((s) => s.stage));
		const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
			.connection;
		stillMode = prefersReducedMotion() || !!connection?.saveData;

		let disposed = false;
		let visible = true;
		let measureRaf = 0;
		let tickRaf = 0;
		const loaded: boolean[] = [];
		const objectUrls: string[] = [];
		let target = 0; // film time the scroll position asks for
		let shown = 0; // eased film time actually displayed
		// Matches the CSS breakpoint where the film switches from letterboxed to full-bleed.
		const landscape = window.matchMedia('(min-aspect-ratio: 5/4)');

		const measure = () => {
			measureRaf = 0;
			const line = window.innerHeight * 0.55;
			const hr = heroEl!.getBoundingClientRect();
			heroProgress = Math.min(1, Math.max(0, -hr.top / (hr.height * 0.85)));
			let index = -1;
			let frac = 0;
			// Portrait: the film is letterboxed at the top, so fade step cards out as they scroll
			// up into it rather than letting them cover the building.
			const filmBottom =
				!landscape.matches && posterEl ? posterEl.getBoundingClientRect().bottom : 0;
			// The process label, heading and intro fade line by line the same way as they scroll
			// up over the film.
			// Inline opacity only while fading, so it never overrides the scroll-reveal animation.
			for (const el of introEl?.children ?? []) {
				const fade = filmBottom
					? Math.max(0, (el.getBoundingClientRect().top - filmBottom + 24) / 96)
					: 1;
				(el as HTMLElement).style.opacity = fade < 1 ? String(fade) : '';
			}
			stepEls.forEach((el, i) => {
				const r = el.getBoundingClientRect();
				if (r.top <= line) {
					index = i;
					frac = Math.min(1, Math.max(0, (line - r.top) / r.height));
				}
				const card = el.firstElementChild as HTMLElement | null;
				if (!card) return;
				if (filmBottom) {
					const top = card.getBoundingClientRect().top;
					card.style.opacity = String(Math.min(1, Math.max(0, (top - filmBottom + 24) / 96)));
				} else if (card.style.opacity) {
					card.style.opacity = '';
				}
			});
			active = index;
			target = filmTime({ heroProgress, index, frac, windows });
			// Show where the step ends up rather than a mid-transition frame.
			const next = index < 0 ? FILM.poster : stillAt(windows[index][1]);
			if (next !== still) {
				still = next;
				stillLoaded = false;
			}
			startTick();
		};
		const schedule = () => {
			if (!measureRaf) measureRaf = requestAnimationFrame(measure);
		};

		// Ease the displayed time towards the target so fast scrolls glide instead of jumping,
		// and only issue a new seek once the previous one has finished. Each segment is its own
		// <video>; crossing a boundary shows the next one once it has its frame ready.
		const tick = () => {
			tickRaf = 0;
			if (!visible || stillMode) return;
			const diff = target - shown;
			// Ease small moves so scrolling glides; jump straight there on big moves (fast scroll,
			// scrollbar drag, anchor links) so the film never trails seconds behind the page.
			shown = Math.abs(diff) < 1 / 48 || Math.abs(diff) > 1.5 ? target : shown + diff * 0.2;
			const seg = segmentAt(shown);
			const v = videos[seg];
			if (loaded[seg] && v) {
				const t = segmentTime(shown, seg);
				// Crossing into a segment that is parked on (or next to) the frame needed: show it
				// straight away, then refine, so a boundary never holds on the previous frame.
				if (seg !== current && !v.seeking && Math.abs(v.currentTime - t) < 0.25) current = seg;
				if (!v.seeking && Math.abs(v.currentTime - t) > 1 / 60) v.currentTime = t;
				if (seg !== current && !v.seeking) current = seg;
				// Park the neighbouring segment on its joining frame as a boundary approaches.
				const { start, end } = SEGMENTS[seg];
				const near = shown > end - 0.6 ? seg + 1 : shown < start + 0.6 ? seg - 1 : -1;
				const n = videos[near];
				if (n && near !== current && loaded[near] && !n.seeking) {
					const join = near > seg ? 0 : segmentTime(Infinity, near);
					if (Math.abs(n.currentTime - join) > 1 / 60) n.currentTime = join;
				}
				// Keep the stand-in still up until the right segment is actually on screen.
				if (seg === current) waiting = false;
			} else {
				waiting = true;
			}
			if (shown !== target || (loaded[seg] && seg !== current)) {
				tickRaf = requestAnimationFrame(tick);
			}
		};
		const startTick = () => {
			if (!tickRaf && visible) tickRaf = requestAnimationFrame(tick);
		};

		window.addEventListener('scroll', schedule, { passive: true });
		window.addEventListener('resize', schedule, { passive: true });
		measure();

		const io = new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting;
			startTick();
		});
		io.observe(section);

		// Download the film segment by segment into memory, starting with the one the visitor is
		// at. Scrubbing a stream skips scenes whenever the visitor scrolls past what has buffered
		// (every seek beyond it waits on the network); from memory every frame is instant. A
		// part that has not arrived yet shows its stage still. If a download fails, that
		// segment streams instead; if it cannot play at all, its still stays.
		const loadSegment = async (i: number) => {
			const v = videos[i];
			if (!v) return;
			let src = SEGMENTS[i].src;
			try {
				const res = await fetch(src);
				if (!res.ok || !res.body) throw new Error(`film ${res.status}`);
				// Read the body as a stream: some browsers fail one-shot reads of large bodies.
				const reader = res.body.getReader();
				const chunks: BlobPart[] = [];
				for (;;) {
					const { done, value } = await reader.read();
					if (done) break;
					if (disposed) return void reader.cancel();
					chunks.push(value as Uint8Array<ArrayBuffer>);
				}
				src = URL.createObjectURL(new Blob(chunks, { type: 'video/mp4' }));
				objectUrls.push(src);
			} catch {
				/* stream it instead */
			}
			if (disposed) return;
			await new Promise<void>((resolve) => {
				v.addEventListener('loadeddata', () => resolve(), { once: true });
				v.addEventListener('error', () => resolve(), { once: true });
				v.preload = 'auto';
				v.src = src;
			});
			if (disposed || v.error) return;
			// iOS only paints seeked frames once the element has played. Never wait on it,
			// though: browsers can leave play() pending indefinitely for a muted video that is not
			// visible yet. The segment is still hidden at this point.
			const played = v.play();
			played?.catch(() => {
				/* autoplay refused; seeking still works */
			});
			await Promise.race([played, new Promise((r) => setTimeout(r, 400))]).catch(() => {});
			if (disposed) return;
			v.pause();
			// Park on the frame nearest the current position so crossing into it is instant.
			v.currentTime = segmentTime(shown, i);
			loaded[i] = true;
			startTick();
		};
		const load = async () => {
			for (const i of loadOrder(target)) {
				if (disposed || stillMode) return;
				await loadSegment(i);
			}
		};
		const idle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 200));
		idle(() => void load());

		return () => {
			disposed = true;
			cancelAnimationFrame(measureRaf);
			cancelAnimationFrame(tickRaf);
			io.disconnect();
			window.removeEventListener('scroll', schedule);
			window.removeEventListener('resize', schedule);
			for (const v of videos) {
				if (!v) continue;
				v.removeAttribute('src');
				v.load();
			}
			for (const url of objectUrls) URL.revokeObjectURL(url);
		};
	});
</script>

<section
	bind:this={section}
	class="on-dark relative bg-ink-900 text-limestone-50"
	aria-label="Introduction and construction process"
>
	<!-- Sticky stage: construction film / image / video, with HUD overlays. The absolute track
	     bounds the sticky element to this section, so the stage ends exactly where the section
	     ends instead of overhanging (and covering) the next section. -->
	<div class="pointer-events-none absolute inset-0" aria-hidden="true">
		<div class="sticky top-0 h-svh overflow-hidden">
			{#if mode === 'image' && hero?.image}
				<Img
					image={hero.image}
					priority
					sizes="100vw"
					class="absolute inset-0 h-full w-full opacity-70"
				/>
			{:else if mode === 'video' && hero?.videoUrl}
				<video
					class="absolute inset-0 h-full w-full object-cover opacity-60"
					src={hero.videoUrl}
					autoplay
					muted
					loop
					playsinline
					preload="metadata"
				></video>
			{:else}
				<div class="blueprint-grid absolute inset-0"></div>
				<!-- First frame: the LCP image, and what no-JS visitors see. -->
				<!-- Hidden once the film (or a still) is showing: on portrait screens the frames'
				     faded lower edge is translucent, so the poster would ghost through it. -->
				<img
					bind:this={posterEl}
					src={FILM.poster}
					alt=""
					width={FILM.width}
					height={FILM.height}
					fetchpriority="high"
					decoding="async"
					class={cx('film-frame', (current >= 0 || stillCovers) && 'opacity-0')}
				/>
				{#if !stillMode}
					<!-- One element per film segment; only the one on screen is visible. Segments
					     switch without a transition: neighbouring frames are continuous. -->
					{#each SEGMENTS as segment, i (segment.src)}
						<video
							bind:this={videos[i]}
							class={cx('film-frame', i === current && !stillCovers ? 'opacity-100' : 'opacity-0')}
							muted
							playsinline
							preload="none"
							disablepictureinpicture
							disableremoteplayback
							tabindex="-1"
						></video>
					{/each}
				{/if}
				<!-- Stills: the whole story for reduced motion / data saver, and the stand-in for any
				     part of the film that is still downloading. The film underneath is hidden
				     meanwhile, since on portrait screens a frame's faded edge would let it ghost
				     through. -->
				{#if showStill}
					{#key still}
						<img
							src={still}
							alt=""
							width={FILM.width}
							height={FILM.height}
							decoding="async"
							class="film-frame film-still"
							onload={() => (stillLoaded = true)}
						/>
					{/key}
				{/if}
			{/if}
			<!-- legibility gradients -->
			<div
				class="absolute inset-0 bg-linear-to-t from-ink-900 via-ink-900/35 to-transparent lg:bg-linear-to-r lg:from-ink-900/90 lg:via-ink-900/30"
			></div>
			<div
				class="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-ink-900/80 to-transparent"
			></div>

			<!-- HUD: drawing-sheet title block -->
			<div
				class="absolute top-[calc(var(--spacing-header)+1.25rem)] right-gutter hidden text-right font-mono text-label text-limestone-300 uppercase md:block"
			>
				<p>Drawing SA—01 · Scale 1:500</p>
				{#if hero?.coordinatesLabel}<p class="mt-1 text-limestone-400">
						{hero.coordinatesLabel}
					</p>{/if}
			</div>

			<!-- Stage rail (desktop) -->
			{#if steps.length}
				<ol class="absolute top-1/2 right-gutter hidden -translate-y-1/2 flex-col gap-3 xl:flex">
					{#each steps as step, i (step._key)}
						<li
							class={cx(
								'flex items-center justify-end gap-3 font-mono text-label uppercase transition-colors duration-500',
								i === active ? 'text-copper-300' : 'text-limestone-100/35'
							)}
						>
							<span
								class={cx(
									'rounded-xs bg-ink-900/85 px-2 py-1 transition-opacity duration-500',
									i === active ? 'opacity-100' : 'opacity-0'
								)}>{step.title}</span
							>
							<span
								class={cx(
									'h-px transition-all duration-700 ease-out-expo',
									i === active ? 'w-10 bg-copper-400' : 'w-4 bg-current'
								)}
							></span>
						</li>
					{/each}
				</ol>
			{/if}
		</div>
	</div>

	<div class="relative z-10">
		<!-- Hero -->
		<!-- Sized to the window height as well as its width, so the headline, intro and CTAs
		     always fit in the first screen, even in short laptop windows. -->
		<header
			bind:this={heroEl}
			class="container-page flex min-h-svh flex-col justify-end pt-[calc(var(--spacing-header)+4svh)] pb-[clamp(1.5rem,6svh,6rem)]"
		>
			<div class="max-w-3xl lg:max-w-[44vw]">
				{#if hero?.eyebrow}<p class="sheet-label mb-[clamp(0.75rem,3svh,2rem)]" use:reveal>
						{hero.eyebrow}
					</p>{/if}
				<SplitText
					as="h1"
					text={hero?.headline ?? 'Spacecraft Associates'}
					class="text-[length:min(var(--text-display-2xl),9svh)] leading-[0.92] font-light tracking-[-0.04em] text-balance [&_.split-word:nth-last-child(-n+2)]:italic"
				/>
				{#if hero?.intro}
					<p
						class="mt-[clamp(0.75rem,3svh,2rem)] max-w-xl text-lede text-limestone-200"
						use:reveal={{ delay: 350 }}
					>
						{hero.intro}
					</p>
				{/if}
				<div class="mt-[clamp(1rem,4svh,2.5rem)] flex flex-wrap gap-3" use:reveal={{ delay: 500 }}>
					<CtaButton cta={hero?.primaryCta} size="lg" variant="primary" />
					<CtaButton cta={hero?.secondaryCta} size="lg" variant="outline-light" />
				</div>
			</div>
			<a
				href="#process"
				class="mt-[clamp(1.25rem,6svh,4rem)] inline-flex items-center gap-3 self-start font-mono text-label text-limestone-300 uppercase [@media(max-height:640px)]:hidden"
				style:opacity={1 - heroProgress * 2}
			>
				<span
					class="relative grid size-10 place-items-center overflow-hidden rounded-full border border-limestone-100/30"
				>
					<ArrowDown size={14} class="scroll-cue" aria-hidden="true" />
				</span>
				Scroll to build
			</a>
		</header>

		<!-- Process timeline -->
		{#if steps.length}
			<div id="process" class="container-page pt-section-sm pb-[30svh]">
				<div class="max-w-xl" bind:this={introEl}>
					<p class="sheet-label" use:reveal>Our process</p>
					{#if process?.heading}
						<SplitText text={process.heading} class="mt-6 text-display-lg font-light" />
					{/if}
					{#if process?.intro}<p class="mt-6 text-lede text-limestone-300" use:reveal>
							{process.intro}
						</p>{/if}
				</div>
				<ol class="mt-[20svh] flex flex-col">
					{#each steps as step, i (step._key)}
						<li
							bind:this={stepEls[i]}
							id="stage-{i + 1}"
							class="flex min-h-[110svh] items-end pb-[42svh] lg:min-h-[95svh] lg:items-center lg:pb-0"
							aria-current={i === active ? 'step' : undefined}
						>
							<article
								class={cx(
									// Phones/tablets: the card docks above the contact bar while its stage is active,
									// keeping the top of the screen clear for the film. Solid tint rather than
									// backdrop-blur: blurring a playing video every frame makes scrolling stutter.
									'sticky bottom-[calc(5.5rem+env(safe-area-inset-bottom))] w-full max-w-md rounded-md border bg-ink-900/90 p-5 transition-[border-color] duration-700 ease-out-expo sm:p-7 lg:static lg:bg-ink-900/85 lg:p-9',
									i === active ? 'border-copper-400/60' : 'border-limestone-100/12'
								)}
							>
								<div class="flex items-center justify-between font-mono text-label uppercase">
									<span class="text-copper-300"
										>Stage {String(i + 1).padStart(2, '0')} / {String(steps.length).padStart(
											2,
											'0'
										)}</span
									>
									{#if step.duration}<span class="text-limestone-400">{step.duration}</span>{/if}
								</div>
								<h3
									class="mt-4 font-display text-[1.65rem] leading-tight font-light sm:text-display-md lg:mt-6"
								>
									{step.title}
								</h3>
								{#if step.description}<p
										class="mt-3 text-[0.95rem] leading-relaxed text-limestone-200 lg:mt-4 lg:text-base"
									>
										{step.description}
									</p>{/if}
								<div class="mt-8 h-px w-full bg-limestone-100/12">
									<div
										class="h-px origin-left bg-copper-400 transition-transform duration-700 ease-out-expo"
										style:transform="scaleX({i < active ? 1 : i === active ? 0.5 : 0})"
									></div>
								</div>
							</article>
						</li>
					{/each}
				</ol>
			</div>
		{/if}
	</div>
</section>

<style>
	/* Portrait screens: the 16:9 film sits letterboxed under the header.
	   Landscape screens: full-bleed, with the building in the right third. */
	.film-frame {
		position: absolute;
		inset-inline: 0;
		top: calc(var(--spacing-header) + 0.75rem);
		width: 100%;
		height: auto;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		/* Fade the lower edge into the ink background so hero copy that runs over it stays legible. */
		mask-image: linear-gradient(to bottom, #000 45%, transparent);
		filter: brightness(0.8);
	}
	@media (min-aspect-ratio: 5/4) {
		.film-frame {
			inset: 0;
			height: 100%;
			aspect-ratio: auto;
			mask-image: none;
			filter: none;
		}
	}
	.film-still {
		animation: still-in 600ms ease-out both;
	}
	@keyframes still-in {
		from {
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: no-preference) {
		:global(.scroll-cue) {
			animation: cue 2.2s var(--ease-in-out-quint) infinite;
		}
	}
	@keyframes cue {
		0% {
			transform: translateY(-160%);
		}
		45%,
		55% {
			transform: translateY(0);
		}
		100% {
			transform: translateY(160%);
		}
	}
</style>
