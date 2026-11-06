<!--
	"Why Spacecraft Associates" — a dark specification sheet. A soft copper light follows the
	pointer across the sheet, and each pillar's icon draws itself on entry.
-->
<script lang="ts">
	import type { Feature } from '$lib/types';
	import { reveal, spotlight } from '$lib/motion/actions';
	import Icon from '$lib/components/ui/Icon.svelte';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';

	let { heading, intro, pillars }: { heading?: string; intro?: string; pillars: Feature[] } =
		$props();
</script>

<section
	class="spot on-dark relative overflow-hidden bg-ink-900 py-section text-limestone-50"
	aria-labelledby="pillars-heading"
	use:spotlight
>
	<div class="blueprint-grid pointer-events-none absolute inset-0" aria-hidden="true"></div>
	<div class="spot-light pointer-events-none absolute inset-0" aria-hidden="true"></div>
	<div class="container-page relative">
		<SectionHeading id="pillars-heading" number="SA—04" eyebrow="Commitments" {heading} {intro} />
		<ol
			class="mt-16 grid gap-px overflow-hidden rounded-md bg-limestone-100/12 sm:grid-cols-2 lg:grid-cols-5"
		>
			{#each pillars as pillar, i (pillar._key)}
				<li
					class="group relative flex flex-col gap-10 bg-ink-900 p-7 transition-colors duration-500 hover:bg-ink-800 lg:min-h-[26rem]"
					use:reveal={{ delay: i * 80 }}
				>
					<div class="flex items-center justify-between">
						<span class="font-mono text-label text-limestone-400"
							>{String(i + 1).padStart(2, '0')}</span
						>
						<span class="text-copper-400" use:reveal={{ mode: 'icon' }}>
							<Icon name={pillar.icon} size={34} strokeWidth={1.2} />
						</span>
					</div>
					<div class="mt-auto">
						<h3 class="font-display text-2xl leading-tight font-light">{pillar.title}</h3>
						{#if pillar.description}<p class="mt-3 text-sm leading-relaxed text-limestone-300">
								{pillar.description}
							</p>{/if}
					</div>
					<span
						class="absolute inset-x-7 bottom-0 h-px origin-left scale-x-0 bg-copper-400 transition-transform duration-700 ease-out-expo group-hover:scale-x-100"
						aria-hidden="true"
					></span>
				</li>
			{/each}
		</ol>
	</div>
</section>

<style>
	.spot-light {
		background: radial-gradient(
			32rem circle at var(--mx, 70%) var(--my, 20%),
			rgb(208 132 95 / 0.14),
			transparent 60%
		);
		transition: background 0.2s linear;
	}
</style>
