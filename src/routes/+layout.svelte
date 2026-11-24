<script lang="ts">
	import '@fontsource-variable/newsreader/opsz.css';
	import '@fontsource-variable/newsreader/opsz-italic.css';
	import '@fontsource-variable/manrope/wght.css';
	import '@fontsource/ibm-plex-mono/latin-400.css';
	import '@fontsource/ibm-plex-mono/latin-500.css';
	import './layout.css';

	import X from '@lucide/svelte/icons/x';
	import { onMount } from 'svelte';
	import { onNavigate } from '$app/navigation';
	import { navigating } from '$app/state';
	import { prefersReducedMotion } from '$lib/motion/actions';
	import { imageUrl } from '$lib/sanity/image';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import ContactActions from '$lib/components/layout/ContactActions.svelte';
	import ConsultationDialog from '$lib/components/layout/ConsultationDialog.svelte';
	import JsonLd from '$lib/components/seo/JsonLd.svelte';

	let { data, children } = $props();
	const settings = $derived(data.settings);

	let bannerDismissed = $state(false);
	onMount(() => {
		try {
			bannerDismissed = sessionStorage.getItem('sb-demo-banner') === '1';
		} catch {
			/* storage unavailable */
		}
	});

	// Cinematic page transitions via the View Transitions API (skipped for filter/query changes).
	onNavigate((navigation) => {
		if (!document.startViewTransition || prefersReducedMotion()) return;
		if (navigation.from?.url.pathname === navigation.to?.url.pathname) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	const a = $derived(settings.address);
	const organization = $derived({
		'@context': 'https://schema.org',
		'@type': 'GeneralContractor',
		'@id': `${data.siteUrl}/#organization`,
		name: settings.siteName,
		legalName: settings.organization?.legalName,
		url: data.siteUrl,
		logo: `${data.siteUrl}/favicon.svg`,
		image: (() => {
			const src = imageUrl(settings.seo?.image, 1200, 630);
			return src ? (src.startsWith('http') ? src : `${data.siteUrl}${src}`) : undefined;
		})(),
		description: settings.seo?.description,
		telephone: settings.contact?.phone,
		email: settings.contact?.email,
		foundingDate: settings.organization?.foundingYear
			? String(settings.organization.foundingYear)
			: undefined,
		priceRange: settings.organization?.priceRange,
		address: a && {
			'@type': 'PostalAddress',
			streetAddress: [a.line1, a.line2].filter(Boolean).join(', '),
			addressLocality: a.city,
			addressRegion: a.state,
			postalCode: a.postalCode,
			addressCountry: a.country ?? 'IN'
		},
		geo:
			a?.lat && a?.lng
				? { '@type': 'GeoCoordinates', latitude: a.lat, longitude: a.lng }
				: undefined,
		areaServed: settings.serviceAreas?.map((name) => ({ '@type': 'City', name })),
		sameAs: settings.social?.map((s) => s.url)
	});
</script>

<a
	href="#main"
	class="fixed top-3 left-3 z-[200] -translate-y-24 rounded-pill bg-ink-900 px-5 py-3 font-semibold text-limestone-50 transition-transform focus:translate-y-0"
>
	Skip to content
</a>

{#if navigating.to}
	<div
		class="fixed inset-x-0 top-0 z-[150] h-0.5 overflow-hidden"
		role="progressbar"
		aria-label="Loading page"
	>
		<div class="nav-progress h-full w-full origin-left bg-copper-500"></div>
	</div>
{/if}

<Header navigation={data.navigation} {settings} />

{#if settings.demoNotice && !bannerDismissed}
	<div
		class="fixed inset-x-0 bottom-[4.5rem] z-30 flex justify-center px-3 lg:bottom-6 lg:justify-start lg:pl-6"
	>
		<div
			class="flex max-w-xl items-start gap-3 rounded-md bg-ink-900/95 py-3 pr-2 pl-4 text-xs leading-relaxed text-limestone-200 shadow-lift backdrop-blur"
			role="note"
		>
			<span class="mt-0.5 font-mono text-copper-300 uppercase">Demo</span>
			<p>{settings.demoNotice}</p>
			<button
				type="button"
				class="grid size-7 shrink-0 place-items-center rounded-full hover:bg-limestone-50/10"
				aria-label="Dismiss demo notice"
				onclick={() => {
					bannerDismissed = true;
					try {
						sessionStorage.setItem('sb-demo-banner', '1');
					} catch {
						/* storage unavailable */
					}
				}}
			>
				<X size={14} aria-hidden="true" />
			</button>
		</div>
	</div>
{/if}

<main id="main" tabindex="-1" class="outline-none">
	{@render children()}
</main>

<Footer footer={data.footer} {settings} instagram={data.instagram} />
<ContactActions {settings} />
<ConsultationDialog />
<JsonLd data={organization} />

<style>
	.nav-progress {
		animation: nav-progress 1.4s var(--ease-out-quart) forwards;
	}
	@keyframes nav-progress {
		from {
			transform: scaleX(0);
		}
		to {
			transform: scaleX(0.85);
		}
	}
</style>
