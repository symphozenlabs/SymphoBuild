<!--
	Per-page metadata. Falls back to Site Settings SEO defaults from Sanity.
-->
<script lang="ts">
	import { page } from '$app/state';
	import { imageUrl } from '$lib/sanity/image';
	import type { Seo, SiteSettings } from '$lib/types';

	type Props = {
		seo?: Seo | null;
		title?: string;
		description?: string;
		type?: 'website' | 'article';
		publishedTime?: string;
		modifiedTime?: string;
		noIndex?: boolean;
	};
	let {
		seo,
		title,
		description,
		type = 'website',
		publishedTime,
		modifiedTime,
		noIndex
	}: Props = $props();

	const settings = $derived(page.data.settings as SiteSettings | undefined);
	const siteUrl = $derived((page.data.siteUrl as string) ?? '');
	const siteName = $derived(settings?.siteName ?? 'Spacecraft Associates');

	const fullTitle = $derived.by(() => {
		const t = seo?.title || title;
		if (!t) return settings?.seo?.title ?? siteName;
		return t.includes(siteName) ? t : `${t} | ${siteName}`;
	});
	const desc = $derived(seo?.description || description || settings?.seo?.description || '');
	const canonical = $derived(
		seo?.canonical || `${siteUrl}${page.url.pathname === '/' ? '' : page.url.pathname}`
	);
	const ogImage = $derived.by(() => {
		const src = imageUrl(seo?.image ?? settings?.seo?.image, 1200, 630);
		if (!src) return undefined;
		return src.startsWith('http') ? src : `${siteUrl}${src}`;
	});
	const robots = $derived(
		noIndex || seo?.noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'
	);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={desc} />
	<meta name="robots" content={robots} />
	<link rel="canonical" href={canonical} />
	<meta property="og:site_name" content={siteName} />
	<meta property="og:type" content={type} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={desc} />
	<meta property="og:url" content={canonical} />
	<meta property="og:locale" content="en_IN" />
	{#if ogImage}
		<meta property="og:image" content={ogImage} />
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />
		<meta name="twitter:image" content={ogImage} />
	{/if}
	{#if publishedTime}<meta property="article:published_time" content={publishedTime} />{/if}
	{#if modifiedTime}<meta property="article:modified_time" content={modifiedTime} />{/if}
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={desc} />
</svelte:head>
