<!--
	Home hero + "From drawing board to door key" process timeline, sharing one sticky stage.
	Scrolling through the Sanity-managed process steps scrubs a photoreal construction film
	(static/hero; timeline in $lib/hero-film): site drawings → marked-out plot → frame →
	envelope → finishes → blue-hour handover.

	Progressive layers:
	  1. SSR / no-JS          → hero + steps in normal flow over the film's first frame
	  2. Reduced motion /
	     data saver           → a still from the film per step, cross-faded (no scrubbing)
	  3. Default              → the film downloads after first paint and is scrubbed by scroll
	Landscape screens show the film full-bleed; portrait phones show it letterboxed at the top
	of the screen, above the docked step card.
-->
<script lang="ts">
	import ArrowDown from '@lucide/svelte/icons/arrow-down';
	import { onMount } from 'svelte';
	import type { HomePage } from '$lib/types';
	import { cx } from '$lib/utils';
	import { FILM, filmTime, stageWindow, stillAt } from '$lib/hero-film';
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
	let video: HTMLVideoElement | undefined = $state();
	let posterEl: HTMLImageElement | undefined = $state();
	let stepEls: HTMLElement[] = $state([]);
	let active = $state(-1);
	let heroProgress = $state(0);
	let filmReady = $state(false);
	/** Set when the film is skipped (reduced motion, data saver, load failure). */
	let stillMode = $state(false);
	let still = $state<string>(FILM.poster);

	onMount(() => {
		if (!section || !heroEl || mode !== 'scene') return;
		const hasFoundation = steps.some((s) => s.stage === 'foundation');
		const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
			.connection;
		stillMode = prefersReducedMotion() || !!connection?.saveData;

		let disposed = false;
		let visible = true;
		let measureRaf = 0;
		let tickRaf = 0;
		let target = 0; // film time the scroll position asks for
		let shown = 0; // eased film time actually displayed
		let objectUrl: string | undefined;
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
			const opts = { heroProgress, index, stage: steps[index]?.stage, count: steps.length };
			target = filmTime({ ...opts, frac, hasFoundation });
			if (stillMode) {
				// Show where the step ends up rather than a mid-transition frame.
				still =
					index < 0
						? FILM.poster
						: stillAt(stageWindow(opts.stage, index, steps.length, hasFoundation)[1]);
			}
			startTick();
		};
		const schedule = () => {
			if (!measureRaf) measureRaf = requestAnimationFrame(measure);
		};

		// Ease the displayed time towards the target so fast scrolls glide instead of jumping,
		// and only issue a new seek once the previous one has finished.
		const tick = () => {
			tickRaf = 0;
			if (!video || !filmReady || !visible) return;
			const diff = target - shown;
			shown = Math.abs(diff) < 1 / 48 ? target : shown + diff * 0.2;
			if (!video.seeking && Math.abs(video.currentTime - shown) > 1 / 60) {
				video.currentTime = shown;
			}
			if (shown !== target) tickRaf = requestAnimationFrame(tick);
		};
		const startTick = () => {
			if (!tickRaf && filmReady && visible) tickRaf = requestAnimationFrame(tick);
		};

		window.addEventListener('scroll', schedule, { passive: true });
		window.addEventListener('resize', schedule, { passive: true });
		measure();

		const io = new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting;
			startTick();
		});
		io.observe(section);

		// Download the whole film into memory so every seek is instant, after first paint.
		const load = async () => {
			if (disposed || stillMode || !video) return;
			const wide = window.innerWidth >= 900 && window.devicePixelRatio * window.innerWidth >= 1100;
			const src = wide ? FILM.sources.hd : FILM.sources.sd;
			try {
				const res = await fetch(src);
				if (!res.ok) throw new Error(`HTTP ${res.status}`);
				const blob = await res.blob();
				if (disposed) return;
				objectUrl = URL.createObjectURL(blob);
				video.src = objectUrl;
			} catch {
				if (disposed) return;
				// Fall back to streaming with range requests.
				video.preload = 'auto';
				video.src = src;
			}
			video.addEventListener(
				'loadeddata',
				async () => {
					if (disposed || !video) return;
					// iOS only paints seeked frames once the element has played.
					try {
						await video.play();
					} catch {
						/* autoplay refused; seeking still works elsewhere */
					}
					video.pause();
					shown = target;
					video.currentTime = shown;
					filmReady = true;
					startTick();
				},
				{ once: true }
			);
			video.addEventListener(
				'error',
				() => {
					stillMode = true;
					schedule();
				},
				{ once: true }
			);
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
			if (video) {
				video.removeAttribute('src');
				video.load();
			}
			if (objectUrl) URL.revokeObjectURL(objectUrl);
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
				<img
					bind:this={posterEl}
					src={FILM.poster}
					alt=""
					width={FILM.width}
					height={FILM.height}
					fetchpriority="high"
					decoding="async"
					class="film-frame"
				/>
				{#if stillMode}
					{#key still}
						<img
							src={still}
							alt=""
							width={FILM.width}
							height={FILM.height}
							decoding="async"
							class="film-frame film-still"
						/>
					{/key}
				{:else}
					<video
						bind:this={video}
						class={cx(
							'film-frame transition-opacity duration-700 ease-out',
							filmReady ? 'opacity-100' : 'opacity-0'
						)}
						muted
						playsinline
						preload="none"
						disablepictureinpicture
						disableremoteplayback
						tabindex="-1"
					></video>
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
				<div class="max-w-xl">
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
