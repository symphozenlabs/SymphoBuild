<script lang="ts">
	import SlidersHorizontal from '@lucide/svelte/icons/sliders-horizontal';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import { flip } from 'svelte/animate';
	import { fade, scale } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { navigating } from '$app/state';
	import { prefersReducedMotion } from '$lib/motion/actions';
	import { cx } from '$lib/utils';
	import Seo from '$lib/components/seo/Seo.svelte';
	import PageHero from '$lib/components/sections/PageHero.svelte';
	import PageSections from '$lib/components/sections/PageSections.svelte';
	import ProjectCard from '$lib/components/projects/ProjectCard.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';

	let { data } = $props();
	let form: HTMLFormElement | undefined = $state();
	const f = $derived(data.filters);
	const activeCount = $derived(Object.values(f).filter(Boolean).length);
	const dur = (ms: number) => (prefersReducedMotion() ? 0 : ms);
	const loading = $derived(navigating.to?.url.pathname === '/projects');

	function apply() {
		if (!form) return;
		// eslint-disable-next-line svelte/prefer-svelte-reactivity -- local, non-reactive builder
		const params = new URLSearchParams();
		for (const [k, v] of new FormData(form)) if (v) params.set(k, String(v));
		const qs = params.toString();
		goto(qs ? `?${qs}` : '/projects', { keepFocus: true, noScroll: true, replaceState: true });
	}

	const selects = $derived(
		[
			{ name: 'type', label: 'Property type', options: data.options.types, value: f.type },
			{ name: 'city', label: 'Location', options: data.options.cities, value: f.city },
			{ name: 'bhk', label: 'Bedrooms', options: data.options.bhks, value: f.bhk },
			{ name: 'budget', label: 'Budget', options: data.options.budgets, value: f.budget }
		].filter((s) => s.options.length > 1 || s.value)
	);
</script>

<Seo seo={data.page?.seo} title="Projects" />

<PageHero
	eyebrow={data.page?.hero?.eyebrow ?? 'Portfolio'}
	heading={data.page?.hero?.heading ?? 'Projects'}
	intro={data.page?.hero?.intro}
	crumbs={[{ label: 'Projects' }]}
	sheet="SA—P · Catalogue"
/>

<section class="container-page pb-section" aria-labelledby="results-heading">
	<form
		bind:this={form}
		method="GET"
		action="/projects"
		class="sticky top-[calc(var(--spacing-header)+0.5rem)] z-20 -mx-2 rounded-lg border border-ink-900/10 bg-limestone-50/90 p-3 shadow-plate backdrop-blur-xl sm:mx-0 sm:p-4"
		onchange={apply}
		onsubmit={(e) => {
			e.preventDefault();
			apply();
		}}
		aria-label="Filter projects"
	>
		<fieldset>
			<legend class="sr-only">Status</legend>
			<div class="-mx-1 flex [scrollbar-width:none] gap-1.5 overflow-x-auto px-1 pb-1">
				{#each [{ value: '', label: 'All', count: data.total }, ...data.options.statuses] as opt (opt.value)}
					<label
						class="relative inline-flex min-h-10 shrink-0 cursor-pointer items-center gap-2 rounded-pill border border-ink-900/15 px-4 text-sm font-medium transition-colors hover:border-ink-900/40 has-checked:border-ink-900 has-checked:bg-ink-900 has-checked:text-limestone-50 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-copper-500"
					>
						<input
							type="radio"
							name="status"
							value={opt.value}
							checked={f.status === opt.value}
							class="sr-only"
						/>
						{opt.label}
						<span class="font-mono text-[0.68rem] opacity-60">{opt.count}</span>
					</label>
				{/each}
			</div>
		</fieldset>
		<div class="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto]">
			{#each selects as s (s.name)}
				<div>
					<label for="filter-{s.name}" class="sr-only">{s.label}</label>
					<select id="filter-{s.name}" name={s.name} class="field-input min-h-11! py-2! text-sm">
						<option value="">{s.label}: any</option>
						{#each s.options as o (o.value)}
							<option value={o.value} selected={o.value === s.value}>{o.label}</option>
						{/each}
					</select>
				</div>
			{/each}
			<div class="col-span-2 flex items-center gap-2 lg:col-span-1">
				<noscript
					><button
						type="submit"
						class="min-h-11 rounded-pill bg-ink-900 px-5 text-sm font-semibold text-limestone-50"
						>Apply</button
					></noscript
				>
				{#if activeCount}
					<a
						href="/projects"
						class="inline-flex min-h-11 items-center gap-2 rounded-pill px-4 text-sm font-semibold text-copper-600 hover:bg-copper-200/40"
					>
						<RotateCcw size={14} aria-hidden="true" /> Reset
					</a>
				{/if}
			</div>
		</div>
	</form>

	<div class="mt-10 flex items-center justify-between gap-4">
		<h2
			id="results-heading"
			class="flex items-center gap-3 font-mono text-label text-ink-500 uppercase"
			aria-live="polite"
		>
			<SlidersHorizontal size={14} aria-hidden="true" />
			Showing {data.projects.length} of {data.total} projects
		</h2>
	</div>

	<div
		class={cx('mt-8 transition-opacity duration-300', loading && 'opacity-50')}
		aria-busy={loading}
	>
		{#if data.projects.length}
			<ul class="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
				{#each data.projects as project, i (project._id)}
					<li
						animate:flip={{ duration: dur(600) }}
						in:scale={{ start: 0.96, duration: dur(500), delay: dur(i * 40) }}
						out:fade={{ duration: dur(200) }}
					>
						<ProjectCard {project} index={i} headingLevel="h3" />
					</li>
				{/each}
			</ul>
		{:else}
			<EmptyState
				title="No projects match these filters"
				text="Try widening your search — or tell us what you are looking for and we will let you know when something fits."
			>
				<div class="flex flex-wrap justify-center gap-3">
					<Button href="/projects" variant="secondary">Clear filters</Button>
					<Button href="/contact#consultation">Talk to us</Button>
				</div>
			</EmptyState>
		{/if}
	</div>
</section>

<PageSections sections={data.page?.sections} />
