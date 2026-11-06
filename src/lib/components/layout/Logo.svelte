<!--
	Spacecraft Associates mark: a drawing-sheet square holding three floor slabs and a single
	copper fin — the building and the brand accent in one glyph. If an uploaded logo
	exists in Site Settings it is used instead.
-->
<script lang="ts">
	import { imageUrl } from '$lib/sanity/image';
	import type { SanityImage } from '$lib/types';

	let {
		name = 'Spacecraft Associates',
		logo,
		class: className = ''
	}: { name?: string; logo?: SanityImage; class?: string } = $props();
	const src = $derived(logo ? imageUrl(logo, 320) : undefined);
</script>

{#if src}
	<img {src} alt={logo?.alt || name} class="h-9 w-auto {className}" width="160" height="36" />
{:else}
	<span class="inline-flex items-center gap-3 {className}">
		<svg viewBox="0 0 32 32" class="size-8 shrink-0" fill="none" aria-hidden="true">
			<rect
				x="1.5"
				y="1.5"
				width="29"
				height="29"
				rx="1"
				stroke="currentColor"
				stroke-width="1.5"
			/>
			<path d="M7 10.5h18M7 16h18M7 21.5h18" stroke="currentColor" stroke-width="1.5" />
			<path d="M21 6.5v19" stroke="var(--color-copper-500)" stroke-width="2.5" />
		</svg>
		<span class="font-display text-[1.35rem] leading-none tracking-[-0.02em]">
			{name.split(' ')[0]}<span class="font-light italic">
				{name.split(' ').slice(1).join(' ')}</span
			>
		</span>
	</span>
{/if}
