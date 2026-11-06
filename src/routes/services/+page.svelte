<script lang="ts">
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import { reveal, tilt } from '$lib/motion/actions';
	import Seo from '$lib/components/seo/Seo.svelte';
	import PageHero from '$lib/components/sections/PageHero.svelte';
	import PageSections from '$lib/components/sections/PageSections.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import Img from '$lib/components/ui/Img.svelte';

	let { data } = $props();
</script>

<Seo seo={data.page?.seo} title="Services" />
<PageHero
	eyebrow={data.page?.hero?.eyebrow ?? 'Services'}
	heading={data.page?.hero?.heading ?? 'Services'}
	intro={data.page?.hero?.intro}
	crumbs={[{ label: 'Services' }]}
	sheet="SA—S · Index"
/>

<section class="container-page pb-section" aria-label="All services">
	<ol class="grid gap-6 md:grid-cols-2">
		{#each data.services as s, i (s._id)}
			<li class={i === 0 ? 'md:col-span-2' : ''} use:reveal={{ delay: (i % 2) * 90 }}>
				<article
					class="group relative grid h-full overflow-hidden rounded-lg bg-limestone-50 shadow-hairline transition-shadow duration-500 hover:shadow-lift {i ===
					0
						? 'lg:grid-cols-2'
						: ''}"
					use:tilt={{ max: 2 }}
				>
					<div class="overflow-hidden">
						<Img
							image={s.heroImage}
							aspect={i === 0 ? 4 / 3 : 16 / 9}
							sizes={i === 0 ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 768px) 50vw, 100vw'}
							class={i === 0 ? 'aspect-[4/3] h-full' : 'aspect-video'}
							imgClass="transition-transform duration-[1400ms] ease-out-expo group-hover:scale-105"
						/>
					</div>
					<div class="flex flex-col p-7 sm:p-9">
						<div class="flex items-center justify-between">
							<span class="font-mono text-label text-ink-500"
								>{String(i + 1).padStart(2, '0')} / {String(data.services.length).padStart(
									2,
									'0'
								)}</span
							>
							<span class="text-copper-600"><Icon name={s.icon} size={28} strokeWidth={1.3} /></span
							>
						</div>
						<h2 class="mt-8 font-display text-display-md font-light">
							<a href="/services/{s.slug}" class="after:absolute after:inset-0 after:content-['']"
								>{s.title}</a
							>
						</h2>
						{#if s.summary}<p class="mt-4 max-w-lg text-ink-600">{s.summary}</p>{/if}
						{#if s.deliverables?.length}
							<ul class="mt-6 flex flex-wrap gap-2" aria-label="Deliverables">
								{#each s.deliverables.slice(0, 4) as d (d)}
									<li class="rounded-pill border border-ink-900/15 px-3 py-1 text-xs">{d}</li>
								{/each}
							</ul>
						{/if}
						<span
							class="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-semibold text-copper-600"
							aria-hidden="true"
						>
							Explore service <ArrowUpRight
								size={16}
								class="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
							/>
						</span>
					</div>
				</article>
			</li>
		{/each}
	</ol>
</section>

<PageSections sections={data.page?.sections} />
