<!--
	Home "About" section: who the studio is, then the lines of work it focuses on (homes,
	commercial spaces) as two staggered editorial plates. Images wipe in through a mask and
	drift within their frame as they scroll past (transform-only).
-->
<script lang="ts">
	import type { HomeAbout } from '$lib/types';
	import { cx } from '$lib/utils';
	import { reveal, scrollProgress } from '$lib/motion/actions';
	import CtaButton from '$lib/components/ui/CtaButton.svelte';
	import Img from '$lib/components/ui/Img.svelte';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';

	let { about }: { about: HomeAbout } = $props();

	const areas = $derived(about.focusAreas ?? []);
	const paragraphs = (text?: string) =>
		(text ?? '')
			.split(/\n\s*\n/)
			.map((p) => p.trim())
			.filter(Boolean);
	let shifts = $state<number[]>([]);
</script>

<section class="relative py-section" aria-labelledby="about-heading">
	<div class="container-page">
		<div class="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
			<SectionHeading
				id="about-heading"
				number="SA—02"
				eyebrow={about.eyebrow ?? 'About us'}
				heading={about.heading}
				intro={about.intro}
				size="xl"
			/>
			{#if about.cta}
				<div class="self-start lg:self-auto" use:reveal={{ delay: 200 }}>
					<CtaButton cta={about.cta} variant="secondary" />
				</div>
			{/if}
		</div>

		{#if areas.length}
			<ol
				class={cx(
					'mt-20 grid gap-20 lg:gap-x-12 lg:gap-y-24',
					areas.length > 1 && 'md:grid-cols-2 md:gap-x-8',
					areas.length > 2 && 'lg:grid-cols-3'
				)}
			>
				{#each areas as area, i (area._key)}
					<li class={cx('flex flex-col', i % 2 === 1 && areas.length === 2 && 'md:mt-28')}>
						{#if area.image}
							<div
								class="relative overflow-hidden rounded-md"
								use:reveal={{ mode: 'mask' }}
								use:scrollProgress={{ onProgress: (p) => (shifts[i] = (p - 0.5) * 10) }}
							>
								<div
									class="scale-[1.1] will-change-transform"
									style:transform="translate3d(0, {shifts[i] ?? 0}%, 0)"
								>
									<Img
										image={area.image}
										aspect={4 / 3}
										sizes="(min-width: 768px) 50vw, 100vw"
										class="aspect-[4/3]"
									/>
								</div>
							</div>
						{/if}
						<p
							class="mt-8 flex items-center gap-4 font-mono text-label text-ink-500 uppercase"
							use:reveal
						>
							<span class="text-copper-600">{String(i + 1).padStart(2, '0')}</span>
							<span class="h-px w-10 bg-ink-900/30"></span>
							{#if area.label}{area.label}{/if}
						</p>
						<h3
							class="mt-5 max-w-[20ch] font-display text-display-md font-light"
							use:reveal={{ delay: 80 }}
						>
							{area.title}
						</h3>
						{#each paragraphs(area.text) as para, j (j)}
							<p
								class={cx(
									'max-w-[52ch]',
									j === 0 ? 'mt-5 text-lede text-ink-700' : 'mt-4 text-ink-600'
								)}
								use:reveal={{ delay: 140 + j * 60 }}
							>
								{para}
							</p>
						{/each}
						{#if area.cta}
							<div class="mt-8" use:reveal={{ delay: 260 }}>
								<CtaButton cta={area.cta} variant="ghost" />
							</div>
						{/if}
					</li>
				{/each}
			</ol>
		{/if}
	</div>
</section>
