<script lang="ts">
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import type { Footer, SiteSettings } from '$lib/types';
	import { telLink, whatsappLink } from '$lib/utils';
	import { reveal } from '$lib/motion/actions';

	let { footer, settings }: { footer: Footer | null; settings: SiteSettings } = $props();
	const year = new Date().getFullYear();
	const a = $derived(settings.address);
	// Scale the outline wordmark to the name's length so long names never clip.
	// 12 characters reproduces the original 12.5vw / 15rem sizing.
	const wordmarkSize = $derived.by(() => {
		const n = Math.max(settings.siteName?.length ?? 12, 8);
		return `clamp(2rem, ${(150 / n).toFixed(2)}vw, ${(180 / n).toFixed(2)}rem)`;
	});
</script>

<footer
	class="on-dark relative overflow-hidden bg-ink-950 pb-28 text-limestone-200 lg:pb-10"
	id="site-footer"
>
	<div
		class="blueprint-grid pointer-events-none absolute inset-0 opacity-60"
		aria-hidden="true"
	></div>
	<div class="container-page relative">
		<div class="grid gap-14 border-b border-limestone-100/12 pt-section-sm pb-16 lg:grid-cols-12">
			<div class="lg:col-span-5">
				<p class="sheet-label">{settings.siteName}</p>
				{#if footer?.statement}
					<p class="mt-6 max-w-[26ch] font-display text-display-md text-limestone-50" use:reveal>
						{footer.statement}
					</p>
				{/if}
				<div class="mt-8 flex flex-wrap gap-3">
					{#if telLink(settings)}
						<a
							href={telLink(settings)}
							class="rounded-pill border border-limestone-100/25 px-5 py-3 text-sm font-semibold hover:bg-limestone-50 hover:text-ink-900"
						>
							{settings.contact?.phoneDisplay ?? settings.contact?.phone}
						</a>
					{/if}
					{#if settings.contact?.email}
						<a
							href="mailto:{settings.contact.email}"
							class="rounded-pill border border-limestone-100/25 px-5 py-3 text-sm font-semibold hover:bg-limestone-50 hover:text-ink-900"
						>
							{settings.contact.email}
						</a>
					{/if}
				</div>
			</div>

			<nav
				id="footer-nav"
				aria-label="Footer"
				class="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7"
			>
				{#each footer?.columns ?? [] as col (col._key)}
					<div>
						<h2 class="font-mono text-label text-limestone-400 uppercase">{col.title}</h2>
						<ul class="mt-5 flex flex-col gap-3">
							{#each col.links as link (link._key)}
								<li><a href={link.href} class="link-dim text-limestone-100">{link.label}</a></li>
							{/each}
						</ul>
					</div>
				{/each}
				<div class="col-span-2 sm:col-span-1">
					<h2 class="font-mono text-label text-limestone-400 uppercase">Visit</h2>
					<address class="mt-5 leading-relaxed text-limestone-100 not-italic">
						{#if a?.line1}{a.line1}<br />{/if}
						{#if a?.line2}{a.line2}<br />{/if}
						{a?.city}{a?.postalCode ? ` ${a.postalCode}` : ''}
					</address>
					{#each settings.businessHours ?? [] as h (h._key)}
						<p class="mt-3 text-sm text-limestone-300">{h.days}<br />{h.hours}</p>
					{/each}
					{#if whatsappLink(settings)}
						<a
							href={whatsappLink(settings)}
							target="_blank"
							rel="noopener noreferrer"
							class="link-dim mt-4 inline-flex items-center gap-1 text-copper-300"
						>
							WhatsApp us <ArrowUpRight size={14} aria-hidden="true" />
						</a>
					{/if}
				</div>
			</nav>
		</div>

		<!-- Oversized wordmark, drawn in outline -->
		<p
			class="pointer-events-none overflow-hidden py-10 text-center font-display leading-[0.9] tracking-[-0.05em] whitespace-nowrap text-transparent select-none [-webkit-text-stroke:1px_rgb(244_239_230/0.18)]"
			style:font-size={wordmarkSize}
			aria-hidden="true"
		>
			{settings.siteName}
		</p>

		<div
			class="flex flex-col gap-6 border-t border-limestone-100/12 pt-8 text-sm text-limestone-400 lg:flex-row lg:items-start lg:justify-between"
		>
			<div class="flex flex-col gap-2">
				<p>
					© {year}
					{settings.organization?.legalName ?? settings.siteName}. All rights reserved.
				</p>
				<p>
					Powered by
					<a
						href="https://www.symphozen.com/"
						target="_blank"
						rel="noopener"
						class="link-dim text-limestone-200"
						>SymphoZen Labs<span class="sr-only"> (opens in a new tab)</span></a
					>
				</p>
			</div>
			{#if footer?.disclaimer}<p class="max-w-2xl text-xs leading-relaxed">
					{footer.disclaimer}
				</p>{/if}
			<ul class="flex flex-wrap gap-5">
				{#each footer?.legalLinks ?? [] as link (link._key)}
					<li><a href={link.href} class="link-dim">{link.label}</a></li>
				{/each}
				{#each settings.social ?? [] as s (s._key)}
					<li>
						<a href={s.url} target="_blank" rel="noopener noreferrer" class="link-dim capitalize"
							>{s.platform}<span class="sr-only"> (opens in a new tab)</span></a
						>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</footer>
