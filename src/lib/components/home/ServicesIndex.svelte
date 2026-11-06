<!--
	Services as an editorial index. On desktop a preview image follows the cursor with
	spring easing and tilts with its velocity; on touch devices thumbnails sit inline.
-->
<script lang="ts">
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import { onMount } from 'svelte';
	import type { ServiceCard } from '$lib/types';
	import { hasFinePointer, prefersReducedMotion, reveal } from '$lib/motion/actions';
	import { imageProps } from '$lib/sanity/image';
	import Icon from '$lib/components/ui/Icon.svelte';
	import Img from '$lib/components/ui/Img.svelte';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';

	let { heading, intro, services }: { heading?: string; intro?: string; services: ServiceCard[] } =
		$props();

	let list: HTMLElement | undefined = $state();
	let preview: HTMLDivElement | undefined = $state();
	let hovered = $state(-1);
	let enabled = $state(false);

	onMount(() => {
		if (!hasFinePointer() || !list) return;
		enabled = true;
		const reduced = prefersReducedMotion();
		let x = 0;
		let y = 0;
		let tx = 0;
		let ty = 0;
		let raf = 0;
		const loop = () => {
			const vx = tx - x;
			x += vx * (reduced ? 1 : 0.14);
			y += (ty - y) * (reduced ? 1 : 0.14);
			if (preview)
				preview.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${reduced ? 0 : Math.max(-8, Math.min(8, vx * 0.05))}deg)`;
			raf = requestAnimationFrame(loop);
		};
		const onMove = (e: PointerEvent) => {
			const r = list!.getBoundingClientRect();
			tx = e.clientX - r.left;
			ty = e.clientY - r.top;
		};
		list.addEventListener('pointermove', onMove);
		raf = requestAnimationFrame(loop);
		return () => {
			cancelAnimationFrame(raf);
			list?.removeEventListener('pointermove', onMove);
		};
	});
</script>

<section class="py-section" aria-labelledby="services-heading">
	<div class="container-page">
		<SectionHeading id="services-heading" number="SA—03" eyebrow="Services" {heading} {intro} />

		<div
			class="relative mt-16"
			bind:this={list}
			role="presentation"
			onpointerleave={() => (hovered = -1)}
		>
			<ol class="border-t border-ink-900/15">
				{#each services as service, i (service._id)}
					<li class="border-b border-ink-900/15" use:reveal={{ delay: i * 50 }}>
						<a
							href="/services/{service.slug}"
							class="group grid grid-cols-[auto_1fr_auto] items-center gap-5 py-7 sm:gap-8 lg:grid-cols-[4rem_1fr_1fr_auto] lg:py-9"
							onpointerenter={() => (hovered = i)}
							onfocus={() => (hovered = i)}
						>
							<span class="font-mono text-label text-ink-500">{String(i + 1).padStart(2, '0')}</span
							>
							<span class="flex items-center gap-4">
								{#if !enabled}
									<span class="hidden size-16 shrink-0 overflow-hidden rounded-sm sm:block">
										<Img image={service.heroImage} aspect={1} sizes="64px" class="size-16" />
									</span>
								{/if}
								<span
									class="font-display text-[clamp(1.6rem,1.1rem+2.4vw,3.4rem)] leading-[1.05] font-light tracking-[-0.025em] transition-[transform,color] duration-700 ease-out-expo group-hover:translate-x-3 group-hover:text-copper-600"
								>
									{service.title}
								</span>
							</span>
							<span class="hidden max-w-sm text-ink-600 lg:block">{service.summary}</span>
							<span
								class="grid size-12 place-items-center rounded-full border border-ink-900/20 transition-all duration-500 ease-out-expo group-hover:border-ink-900 group-hover:bg-ink-900 group-hover:text-limestone-50"
							>
								<Icon name={service.icon} size={20} class="group-hover:hidden" />
								<ArrowRight size={18} class="hidden group-hover:block" aria-hidden="true" />
							</span>
						</a>
					</li>
				{/each}
			</ol>

			{#if enabled}
				<div
					bind:this={preview}
					class="pointer-events-none absolute top-0 left-0 z-10 hidden lg:block"
					aria-hidden="true"
				>
					<div
						class="-translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-md shadow-lift transition-[opacity,scale] duration-500 ease-out-expo"
						style:opacity={hovered >= 0 ? 1 : 0}
						style:scale={hovered >= 0 ? 1 : 0.85}
					>
						<div class="relative h-[15rem] w-[21rem]">
							{#each services as service, i (service._id)}
								{@const img = imageProps(service.heroImage, {
									aspect: 21 / 15,
									widths: [480, 768]
								})}
								{#if img}
									<img
										src={img.src}
										srcset={img.srcset}
										sizes="336px"
										alt=""
										loading="lazy"
										class="absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out-expo"
										style:opacity={hovered === i ? 1 : 0}
										style:transform="scale({hovered === i ? 1 : 1.15})"
									/>
								{/if}
							{/each}
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</section>
