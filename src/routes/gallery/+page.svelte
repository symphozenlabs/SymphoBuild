<!--
	Filterable visual portfolio. Filters are links (?category=) so they work without JS;
	with JS they filter instantly with an animated reflow. Images open in the lightbox.
-->
<script lang="ts">
	import { flip } from 'svelte/animate';
	import { fade, scale } from 'svelte/transition';
	import { page } from '$app/state';
	import { replaceState } from '$app/navigation';
	import { GALLERY_CATEGORIES, cx } from '$lib/utils';
	import { prefersReducedMotion } from '$lib/motion/actions';
	import Seo from '$lib/components/seo/Seo.svelte';
	import PageHero from '$lib/components/sections/PageHero.svelte';
	import Img from '$lib/components/ui/Img.svelte';
	import Lightbox from '$lib/components/ui/Lightbox.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';

	let { data } = $props();
	let category = $state(page.url.searchParams.get('category') ?? '');
	let index = $state(-1);

	const categories = $derived(
		Object.entries(GALLERY_CATEGORIES)
			.map(([value, label]) => ({
				value,
				label,
				count: data.items.filter((i) => i.category === value).length
			}))
			.filter((c) => c.count > 0)
	);
	const visible = $derived(
		category ? data.items.filter((i) => i.category === category) : data.items
	);
	const lightboxItems = $derived(
		visible.map((i) => ({
			image: i.image,
			title: i.title,
			caption: i.project ? i.project.title : GALLERY_CATEGORIES[i.category]
		}))
	);
	const dur = (ms: number) => (prefersReducedMotion() ? 0 : ms);

	function choose(e: MouseEvent, value: string) {
		e.preventDefault();
		category = value;
		const url = new URL(page.url);
		if (value) url.searchParams.set('category', value);
		else url.searchParams.delete('category');
		replaceState(url, {});
	}
</script>

<Seo seo={data.page?.seo} title="Gallery" />
<PageHero
	eyebrow={data.page?.hero?.eyebrow ?? 'Gallery'}
	heading={data.page?.hero?.heading ?? 'Gallery'}
	intro={data.page?.hero?.intro}
	crumbs={[{ label: 'Gallery' }]}
	sheet="SA—G · Portfolio"
/>

<section class="container-page pb-section" aria-labelledby="gallery-count">
	<nav
		aria-label="Gallery categories"
		class="-mx-1 flex [scrollbar-width:none] gap-2 overflow-x-auto px-1 pb-2"
	>
		{#each [{ value: '', label: 'All', count: data.items.length }, ...categories] as c (c.value)}
			<a
				href={c.value ? `?category=${c.value}` : '/gallery'}
				onclick={(e) => choose(e, c.value)}
				aria-current={category === c.value ? 'true' : undefined}
				class={cx(
					'inline-flex min-h-10 shrink-0 items-center gap-2 rounded-pill border px-4 text-sm font-medium transition-colors',
					category === c.value
						? 'border-ink-900 bg-ink-900 text-limestone-50'
						: 'border-ink-900/15 hover:border-ink-900/40'
				)}
			>
				{c.label}<span class="font-mono text-[0.68rem] opacity-60">{c.count}</span>
			</a>
		{/each}
	</nav>
	<p id="gallery-count" class="mt-6 font-mono text-label text-ink-500 uppercase" aria-live="polite">
		{visible.length} images
	</p>

	{#if visible.length}
		<ul
			class="mt-8 grid auto-rows-[12rem] grid-cols-2 gap-3 sm:auto-rows-[16rem] md:grid-cols-3 lg:grid-cols-4"
		>
			{#each visible as item, i (item._id)}
				<li
					class={cx(
						'group relative overflow-hidden rounded-md',
						i % 7 === 0 && 'row-span-2',
						i % 5 === 3 && 'md:col-span-2'
					)}
					animate:flip={{ duration: dur(550) }}
					in:scale={{ start: 0.94, duration: dur(450) }}
					out:fade={{ duration: dur(150) }}
				>
					<button
						type="button"
						class="block h-full w-full text-left"
						onclick={() => (index = i)}
						aria-label="View {item.title}"
					>
						<Img
							image={item.image}
							sizes="(min-width: 1024px) 25vw, 50vw"
							class="h-full w-full"
							imgClass="transition-transform duration-[1200ms] ease-out-expo group-hover:scale-105"
						/>
						<span
							class="on-dark absolute inset-x-0 bottom-0 flex translate-y-2 flex-col bg-linear-to-t from-ink-950/85 to-transparent p-4 pt-10 text-limestone-50 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
						>
							<span class="font-mono text-[0.65rem] tracking-widest text-copper-300 uppercase"
								>{GALLERY_CATEGORIES[item.category] ?? item.category}</span
							>
							<span class="font-display text-lg leading-tight">{item.title}</span>
						</span>
					</button>
				</li>
			{/each}
		</ul>
	{:else}
		<EmptyState title="No images in this category yet" />
	{/if}
</section>

<Lightbox items={lightboxItems} bind:index />
