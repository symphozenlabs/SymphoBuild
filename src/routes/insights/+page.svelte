<script lang="ts">
	import { reveal } from '$lib/motion/actions';
	import { cx } from '$lib/utils';
	import Seo from '$lib/components/seo/Seo.svelte';
	import PageHero from '$lib/components/sections/PageHero.svelte';
	import PostCard from '$lib/components/insights/PostCard.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let { data } = $props();
	const featured = $derived(!data.category && data.pageNo === 1 ? data.posts[0] : undefined);
	const rest = $derived(featured ? data.posts.slice(1) : data.posts);
	const activeCategory = $derived(data.categories.find((c) => c.slug === data.category));
	const href = (category: string, page = 1) => {
		// eslint-disable-next-line svelte/prefer-svelte-reactivity -- local, non-reactive builder
		const p = new URLSearchParams();
		if (category) p.set('category', category);
		if (page > 1) p.set('page', String(page));
		const qs = p.toString();
		return qs ? `/insights?${qs}` : '/insights';
	};
</script>

<Seo
	seo={data.page?.seo}
	title={activeCategory ? `${activeCategory.title} — Insights` : 'Insights'}
	description={activeCategory?.description}
/>
<PageHero
	eyebrow={data.page?.hero?.eyebrow ?? 'Journal'}
	heading={activeCategory?.title ?? data.page?.hero?.heading ?? 'Insights'}
	intro={activeCategory?.description ?? data.page?.hero?.intro}
	crumbs={activeCategory
		? [{ label: 'Insights', href: '/insights' }, { label: activeCategory.title }]
		: [{ label: 'Insights' }]}
	sheet="SA—J · Journal"
/>

<section class="container-page pb-section" aria-label="Articles">
	<nav
		aria-label="Categories"
		class="-mx-1 flex [scrollbar-width:none] gap-2 overflow-x-auto px-1 pb-2"
	>
		{#each [{ slug: '', title: 'All' }, ...data.categories] as c (c.slug)}
			<a
				href={href(c.slug)}
				aria-current={data.category === c.slug ? 'page' : undefined}
				data-sveltekit-noscroll
				class={cx(
					'inline-flex min-h-10 shrink-0 items-center rounded-pill border px-4 text-sm font-medium transition-colors',
					data.category === c.slug
						? 'border-ink-900 bg-ink-900 text-limestone-50'
						: 'border-ink-900/15 hover:border-ink-900/40'
				)}>{c.title}</a
			>
		{/each}
	</nav>

	{#if featured}
		<div class="mt-12 border-b border-ink-900/12 pb-16" use:reveal>
			<PostCard post={featured} large headingLevel="h2" />
		</div>
	{/if}

	{#if rest.length}
		<ul class="mt-14 grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
			{#each rest as post, i (post._id)}
				<li use:reveal={{ delay: (i % 3) * 90 }}><PostCard {post} headingLevel="h2" /></li>
			{/each}
		</ul>
	{:else if !featured}
		<EmptyState
			title="No articles here yet"
			text="We're writing. In the meantime, browse all insights or read the buyer's guide."
		>
			<Button href="/insights" variant="secondary">All insights</Button>
		</EmptyState>
	{/if}

	{#if data.pages > 1}
		<nav aria-label="Pagination" class="mt-16 flex items-center justify-center gap-2">
			{#each Array.from({ length: data.pages }, (_, i) => i + 1) as n (n)}
				<a
					href={href(data.category, n)}
					aria-current={n === data.pageNo ? 'page' : undefined}
					class={cx(
						'grid size-11 place-items-center rounded-full font-mono text-sm',
						n === data.pageNo
							? 'bg-ink-900 text-limestone-50'
							: 'border border-ink-900/15 hover:border-ink-900'
					)}>{n}</a
				>
			{/each}
		</nav>
	{/if}
</section>
