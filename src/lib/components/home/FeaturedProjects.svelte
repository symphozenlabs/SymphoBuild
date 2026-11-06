<!--
	Editorial "plates": alternating image/text rows. Images wipe in through a mask and
	drift within their frame as the row scrolls past (scroll-linked, transform-only).
-->
<script lang="ts">
	import type { ProjectCard } from '$lib/types';
	import { TYPE_LABELS, formatArea, formatBedrooms, cx } from '$lib/utils';
	import { reveal, scrollProgress } from '$lib/motion/actions';
	import Button from '$lib/components/ui/Button.svelte';
	import Img from '$lib/components/ui/Img.svelte';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
	import StatusBadge from '$lib/components/ui/StatusBadge.svelte';

	let { heading, intro, projects }: { heading?: string; intro?: string; projects: ProjectCard[] } =
		$props();
	let shifts = $state<number[]>([]);
</script>

<section class="relative py-section" aria-labelledby="featured-heading">
	<div class="container-page">
		<div class="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
			<SectionHeading id="featured-heading" number="SA—02" eyebrow="Projects" {heading} {intro} />
			<Button href="/projects" variant="secondary" class="self-start lg:self-auto"
				>All projects</Button
			>
		</div>

		<ol class="mt-20 flex flex-col gap-24 lg:gap-36">
			{#each projects as project, i (project._id)}
				{@const reverse = i % 2 === 1}
				<li class="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
					<a
						href="/projects/{project.slug}"
						class={cx(
							'group relative block overflow-hidden rounded-md lg:col-span-7',
							reverse && 'lg:order-2 lg:col-start-6'
						)}
						use:reveal={{ mode: 'mask' }}
						use:scrollProgress={{ onProgress: (p) => (shifts[i] = (p - 0.5) * 12) }}
						tabindex="-1"
						aria-hidden="true"
					>
						<div
							class="scale-[1.12] will-change-transform"
							style:transform="translate3d(0, {shifts[i] ?? 0}%, 0)"
						>
							<Img
								image={project.coverImage}
								aspect={16 / 11}
								sizes="(min-width: 1024px) 58vw, 100vw"
								class="aspect-[16/11]"
								imgClass="transition-transform duration-[1600ms] ease-out-expo group-hover:scale-[1.04]"
							/>
						</div>
						<div class="absolute top-4 left-4"><StatusBadge status={project.status} /></div>
					</a>
					<div class={cx('lg:col-span-5', reverse ? 'lg:order-1 lg:pr-4' : 'lg:pl-4')}>
						<p
							class="flex items-center gap-4 font-mono text-label text-ink-500 uppercase"
							use:reveal
						>
							<span class="text-copper-600"
								>{String(i + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span
							>
							<span class="h-px w-10 bg-ink-900/30"></span>
							{TYPE_LABELS[project.propertyType]}
						</p>
						<h3 class="mt-5 font-display text-display-lg font-light" use:reveal={{ delay: 80 }}>
							<a href="/projects/{project.slug}" class="link-dim">{project.title}</a>
						</h3>
						{#if project.tagline}<p
								class="mt-5 max-w-md text-lede text-ink-600"
								use:reveal={{ delay: 140 }}
							>
								{project.tagline}
							</p>{/if}
						<dl
							class="mt-8 grid grid-cols-2 border-t border-ink-900/12"
							use:reveal={{ delay: 200 }}
						>
							{#each [['Location', [project.location?.locality, project.location?.city]
										.filter(Boolean)
										.join(', ')], ['Homes', formatBedrooms(project.bedrooms)], ['Area', formatArea(project.areaRange)], ['Price', project.priceDisplay]].filter(([, v]) => v) as [label, value] (label)}
								<div class="border-b border-ink-900/12 py-4 pr-4">
									<dt class="font-mono text-label text-ink-500 uppercase">{label}</dt>
									<dd class="mt-1 font-medium">{value}</dd>
								</div>
							{/each}
						</dl>
						<div class="mt-8" use:reveal={{ delay: 260 }}>
							<Button href="/projects/{project.slug}" variant="ghost">View {project.title}</Button>
						</div>
					</div>
				</li>
			{/each}
		</ol>
	</div>
</section>
