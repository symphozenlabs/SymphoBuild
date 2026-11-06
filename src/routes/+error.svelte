<script lang="ts">
	import { page } from '$app/state';
	import BlueprintDrawing from '$lib/components/home/BlueprintDrawing.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	const notFound = $derived(page.status === 404);
</script>

<svelte:head>
	<title>{notFound ? 'Page not found' : 'Something went wrong'} | Spacecraft Associates</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section
	class="container-page grid min-h-[80svh] items-center gap-12 pt-[calc(var(--spacing-header)+3rem)] pb-section lg:grid-cols-2"
>
	<div>
		<p class="sheet-label">Error {page.status}</p>
		<h1 class="mt-6 text-display-xl font-light">
			{notFound ? 'This address isn’t on our drawings.' : 'Something on site needs our attention.'}
		</h1>
		<p class="mt-6 max-w-lg text-lede text-ink-600">
			{notFound
				? 'The page may have moved, or the link may be mistyped. Try one of these instead.'
				: (page.error?.message ?? 'Please try again in a moment.')}
		</p>
		<div class="mt-10 flex flex-wrap gap-3">
			<Button href="/">Back to home</Button>
			<Button href="/projects" variant="secondary">Explore projects</Button>
			<Button href="/contact" variant="ghost">Contact us</Button>
		</div>
	</div>
	<div class="text-copper-500" aria-hidden="true"><BlueprintDrawing floors={8} /></div>
</section>
