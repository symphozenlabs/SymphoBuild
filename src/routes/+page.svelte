<script lang="ts">
	import Seo from '$lib/components/seo/Seo.svelte';
	import BuildStory from '$lib/components/home/BuildStory.svelte';
	import StatsBand from '$lib/components/home/StatsBand.svelte';
	import FeaturedProjects from '$lib/components/home/FeaturedProjects.svelte';
	import ServicesIndex from '$lib/components/home/ServicesIndex.svelte';
	import Pillars from '$lib/components/home/Pillars.svelte';
	import Testimonials from '$lib/components/home/Testimonials.svelte';
	import CtaFinale from '$lib/components/home/CtaFinale.svelte';
	import PostCard from '$lib/components/insights/PostCard.svelte';
	import FaqList from '$lib/components/sections/FaqList.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
	import { reveal } from '$lib/motion/actions';

	let { data } = $props();
	const home = $derived(data.home);
</script>

<Seo seo={home.seo} />

<BuildStory hero={home.hero} process={home.process} />

{#if home.stats?.length}
	<StatsBand heading={home.statsHeading} stats={home.stats} />
{/if}

{#if home.featuredProjects?.length}
	<FeaturedProjects
		heading={home.projectsHeading}
		intro={home.projectsIntro}
		projects={home.featuredProjects}
	/>
{/if}

{#if home.services?.length}
	<ServicesIndex
		heading={home.servicesHeading}
		intro={home.servicesIntro}
		services={home.services}
	/>
{/if}

{#if home.pillars?.length}
	<Pillars heading={home.pillarsHeading} intro={home.pillarsIntro} pillars={home.pillars} />
{/if}

{#if home.testimonials?.length}
	<Testimonials heading={home.testimonialsHeading} testimonials={home.testimonials} />
{/if}

{#if home.posts?.length}
	<section class="bg-limestone-200/60 py-section" aria-labelledby="insights-heading">
		<div class="container-page">
			<div class="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
				<SectionHeading
					id="insights-heading"
					number="SA—06"
					eyebrow="Insights"
					heading={home.insightsHeading}
					intro={home.insightsIntro}
				/>
				<Button href="/insights" variant="secondary" class="self-start lg:self-auto"
					>All insights</Button
				>
			</div>
			<div class="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
				{#each home.posts as post, i (post._id)}
					<div use:reveal={{ delay: i * 100 }}><PostCard {post} /></div>
				{/each}
			</div>
		</div>
	</section>
{/if}

{#if home.faqs?.length}
	<section
		class="container-page grid gap-12 py-section lg:grid-cols-12"
		aria-labelledby="faq-heading"
	>
		<div class="lg:col-span-4">
			<div class="lg:sticky lg:top-32">
				<SectionHeading
					id="faq-heading"
					number="SA—07"
					eyebrow="FAQ"
					heading={home.faqHeading}
					size="md"
				/>
				<div class="mt-8">
					<Button href="/buyers-guide" variant="ghost">Read the buyer's guide</Button>
				</div>
			</div>
		</div>
		<div class="lg:col-span-8"><FaqList faqs={home.faqs} /></div>
	</section>
{/if}

<CtaFinale cta={home.cta} />
