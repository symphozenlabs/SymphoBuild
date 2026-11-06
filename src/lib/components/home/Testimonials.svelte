<!--
	Accessible testimonial carousel (APG pattern): no autoplay, explicit previous/next
	controls, slide picker, polite live region, and all quotes readable without JS.
-->
<script lang="ts">
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import type { Testimonial } from '$lib/types';
	import { cx } from '$lib/utils';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';

	let { heading, testimonials }: { heading?: string; testimonials: Testimonial[] } = $props();
	let current = $state(0);
	let direction = $state(1);
	const go = (i: number) => {
		direction = i > current ? 1 : -1;
		current = (i + testimonials.length) % testimonials.length;
	};
</script>

<section class="py-section" aria-labelledby="testimonials-heading" aria-roledescription="carousel">
	<div class="container-page grid gap-12 lg:grid-cols-12">
		<div class="lg:col-span-4">
			<SectionHeading
				id="testimonials-heading"
				number="SA—05"
				eyebrow="Owners & partners"
				{heading}
				size="md"
			/>
			<div class="mt-10 flex items-center gap-3">
				<button
					type="button"
					class="nav-btn"
					onclick={() => go(current - 1)}
					aria-label="Previous testimonial"
				>
					<ArrowLeft size={18} aria-hidden="true" />
				</button>
				<button
					type="button"
					class="nav-btn"
					onclick={() => go(current + 1)}
					aria-label="Next testimonial"
				>
					<ArrowRight size={18} aria-hidden="true" />
				</button>
				<p class="ml-3 font-mono text-label text-ink-500" aria-live="polite" aria-atomic="true">
					{String(current + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}
				</p>
			</div>
		</div>

		<div class="relative lg:col-span-8">
			<svg
				class="absolute -top-6 -left-2 h-20 w-20 text-copper-500/25"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path
					fill="currentColor"
					d="M3 21v-7.2C3 8.6 5.6 5.2 10.2 4l.8 1.9C8.3 7 7 9 6.8 11.5H11V21H3zm10 0v-7.2c0-5.2 2.6-8.6 7.2-9.8l.8 1.9c-2.7 1.1-4 3.1-4.2 5.6H21V21h-8z"
				/>
			</svg>
			<div class="grid">
				{#each testimonials as t, i (t._id)}
					<figure
						class={cx(
							'quote relative col-start-1 row-start-1 transition-[opacity,visibility] duration-700',
							i === current ? 'visible opacity-100' : 'invisible opacity-0'
						)}
						style:--dir={direction}
						aria-roledescription="slide"
						aria-label="{i + 1} of {testimonials.length}"
						aria-hidden={i !== current}
						data-active={i === current || undefined}
					>
						<blockquote
							class="font-display text-[clamp(1.6rem,1.1rem+2.1vw,3rem)] leading-[1.18] font-light tracking-[-0.015em] text-balance"
						>
							“{t.quote}”
						</blockquote>
						<figcaption class="mt-10 flex flex-wrap items-center gap-x-4 gap-y-1">
							<span class="font-semibold">{t.name}</span>
							{#if t.context}<span class="text-ink-500">{t.context}</span>{/if}
							{#if t.project}
								<a
									href="/projects/{t.project.slug}"
									class="link-dim font-mono text-label text-copper-600 uppercase"
									tabindex={i === current ? 0 : -1}
								>
									{t.project.title}
								</a>
							{/if}
						</figcaption>
					</figure>
				{/each}
			</div>
			<div class="mt-10 flex gap-2" role="group" aria-label="Choose testimonial">
				{#each testimonials as t, i (t._id)}
					<button
						type="button"
						class="group grid h-8 flex-1 items-center"
						onclick={() => go(i)}
						aria-label="Show testimonial {i + 1}"
						aria-current={i === current}
					>
						<span
							class={cx(
								'h-px w-full transition-colors duration-500',
								i === current ? 'bg-copper-500' : 'bg-ink-900/20 group-hover:bg-ink-900/50'
							)}
						></span>
					</button>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.nav-btn {
		display: grid;
		place-items: center;
		width: 3.25rem;
		height: 3.25rem;
		border-radius: 999px;
		border: 1px solid rgb(22 24 26 / 0.2);
		transition:
			background-color 0.3s,
			color 0.3s,
			border-color 0.3s;
	}
	.nav-btn:hover {
		background: var(--color-ink-900);
		color: var(--color-limestone-50);
		border-color: var(--color-ink-900);
	}
	@media (prefers-reduced-motion: no-preference) {
		.quote[data-active] blockquote {
			animation: quote-in 0.9s var(--ease-out-expo) both;
		}
	}
	@keyframes quote-in {
		from {
			opacity: 0;
			transform: translate3d(calc(var(--dir) * 2rem), 0, 0);
			filter: blur(4px);
		}
	}
</style>
