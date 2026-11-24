<!--
	Footer "site journal": the latest Instagram posts as a contact sheet on the drawing board.
	A drawing-sheet title block carries the account (handle, posts, followers, last entry); the
	frames carry crop marks and sheet numbers, and each photo develops from a blueprint tint
	into full colour as it scrolls in. Reels preview on hover. Posts load in the browser only
	as the footer approaches, so the journal never slows a page down.
-->
<script lang="ts">
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import Layers from '@lucide/svelte/icons/layers';
	import Play from '@lucide/svelte/icons/play';
	import Plus from '@lucide/svelte/icons/plus';
	import { onMount } from 'svelte';
	import type { InstagramFeed, InstagramPost, InstagramProfile } from '$lib/types';
	import { hasFinePointer, reveal } from '$lib/motion/actions';
	import { cx } from '$lib/utils';

	let { heading, intro, fallbackUrl }: { heading?: string; intro?: string; fallbackUrl?: string } =
		$props();

	/** First page fills the sheet (one lead frame + eight); later pages add full rows. */
	const FIRST = 9;
	const MORE = 12;

	let root: HTMLElement | undefined = $state();
	let phase = $state<'waiting' | 'ready' | 'hidden'>('waiting');
	let posts = $state<InstagramPost[]>([]);
	let profile = $state<InstagramProfile | null>(null);
	let next = $state<string | null>(null);
	let loadingMore = $state(false);
	let previewing = $state<string | null>(null);

	const profileUrl = $derived(
		profile ? `https://www.instagram.com/${profile.username}/` : fallbackUrl
	);
	const compact = new Intl.NumberFormat('en-IN', { notation: 'compact', maximumFractionDigits: 1 });
	const sheetDate = (iso: string) =>
		new Date(iso)
			.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
			.toUpperCase();
	/** Caption without its hashtag block, for the hover line and the link label. */
	const plain = (caption: string) =>
		caption
			.replace(/#[\p{L}\p{N}_]+/gu, '')
			.replace(/\s+/g, ' ')
			.trim();
	const KIND = { image: 'Photo', video: 'Reel', album: 'Album' } as const;

	async function fetchPage(after?: string): Promise<InstagramFeed> {
		const query = `limit=${after ? MORE : FIRST}${after ? `&after=${encodeURIComponent(after)}` : ''}`;
		const res = await fetch(`/api/instagram?${query}`);
		if (!res.ok) throw new Error(`instagram ${res.status}`);
		return res.json();
	}

	async function loadFirst() {
		try {
			const feed = await fetchPage();
			if (!feed.posts.length) {
				phase = 'hidden';
				return;
			}
			posts = feed.posts;
			profile = feed.profile;
			next = feed.next;
			phase = 'ready';
		} catch {
			phase = 'hidden';
		}
	}

	async function loadMore() {
		if (!next || loadingMore) return;
		loadingMore = true;
		try {
			const feed = await fetchPage(next);
			const seen = new Set(posts.map((p) => p.id));
			posts = [...posts, ...feed.posts.filter((p) => !seen.has(p.id))];
			next = feed.next;
		} catch {
			next = null; // leave "View on Instagram" as the way on
		} finally {
			loadingMore = false;
		}
	}

	onMount(() => {
		if (!root) return;
		const io = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				io.disconnect();
				void loadFirst();
			},
			{ rootMargin: '900px 0px' }
		);
		io.observe(root);
		return () => io.disconnect();
	});
</script>

{#if phase !== 'hidden'}
	<section
		bind:this={root}
		class="grid gap-12 border-b border-limestone-100/12 pt-section-sm pb-16 lg:grid-cols-12 lg:gap-10"
		aria-labelledby="journal-heading"
	>
		<header class="flex flex-col self-start lg:sticky lg:top-28 lg:col-span-4">
			<p class="sheet-label">
				<span class="text-copper-400">SA—IG</span><span>Site journal</span>
			</p>
			<h2
				id="journal-heading"
				class="mt-6 max-w-[16ch] font-display text-display-md text-limestone-50"
				use:reveal
			>
				{heading || 'Follow the build, frame by frame'}
			</h2>
			{#if intro}
				<p class="mt-5 max-w-[40ch] text-limestone-300" use:reveal={{ delay: 100 }}>{intro}</p>
			{/if}

			<!-- Drawing-sheet title block -->
			<dl
				class="title-block mt-8 grid grid-cols-2 border border-limestone-100/20 font-mono text-label uppercase"
				use:reveal={{ delay: 160 }}
			>
				<div class="col-span-2 flex items-center gap-3 border-b border-limestone-100/20 p-3">
					{#if profile?.avatar}
						<img
							src={profile.avatar}
							alt=""
							width="40"
							height="40"
							loading="lazy"
							referrerpolicy="no-referrer"
							class="size-10 rounded-full object-cover ring-1 ring-copper-400/60 ring-offset-2 ring-offset-ink-950"
						/>
					{:else}
						<span
							class="grid size-10 place-items-center rounded-full border border-copper-400/60 text-copper-300"
							aria-hidden="true">SA</span
						>
					{/if}
					<div class="min-w-0">
						<dt class="sr-only">Account</dt>
						<dd class="truncate text-limestone-50 normal-case">
							@{profile?.username ?? 'spacecraft_associates'}
						</dd>
						<dd class="mt-1 text-limestone-400">Instagram</dd>
					</div>
				</div>
				<div class="border-r border-b border-limestone-100/20 p-3">
					<dt class="text-limestone-400">Posts</dt>
					<dd class="mt-1 text-base text-limestone-50">
						{profile?.posts != null ? compact.format(profile.posts) : '—'}
					</dd>
				</div>
				<div class="border-b border-limestone-100/20 p-3">
					<dt class="text-limestone-400">Followers</dt>
					<dd class="mt-1 text-base text-limestone-50">
						{profile?.followers != null ? compact.format(profile.followers) : '—'}
					</dd>
				</div>
				<div class="col-span-2 flex items-center justify-between gap-3 p-3">
					<dt class="text-limestone-400">Last entry</dt>
					<dd class="text-copper-300">{posts[0] ? sheetDate(posts[0].timestamp) : '—'}</dd>
				</div>
			</dl>

			{#if profileUrl}
				<a
					href={profileUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="mt-6 inline-flex items-center gap-2 self-start rounded-pill bg-copper-500 px-5 py-3 text-sm font-semibold text-ink-950 transition-colors hover:bg-copper-400"
				>
					Follow on Instagram <ArrowUpRight size={16} aria-hidden="true" />
					<span class="sr-only">(opens in a new tab)</span>
				</a>
			{/if}
		</header>

		<div class="lg:col-span-8">
			<ul
				class="grid grid-cols-3 gap-2 sm:gap-3 md:grid-cols-4"
				aria-live="polite"
				aria-busy={phase === 'waiting' || loadingMore}
			>
				{#if phase === 'waiting'}
					{#each Array.from({ length: FIRST }, (_, n) => n) as i (i)}
						<li class={cx('frame-skeleton aspect-square', i === 0 && 'col-span-2 row-span-2')}></li>
					{/each}
				{:else}
					{#each posts as post, i (post.id)}
						{@const words = plain(post.caption)}
						<li
							class={cx(i === 0 && 'col-span-2 row-span-2')}
							use:reveal={{ delay: (i % MORE) * 55 }}
						>
							<a
								href={post.permalink}
								target="_blank"
								rel="noopener noreferrer"
								class="frame group relative block aspect-square overflow-hidden rounded-xs bg-ink-800"
								aria-label="{KIND[post.kind]}, {sheetDate(post.timestamp)}{words
									? `: ${words.slice(0, 120)}`
									: ''} (opens Instagram in a new tab)"
								onpointerenter={() => {
									if (post.video && hasFinePointer()) previewing = post.id;
								}}
								onpointerleave={() => {
									if (previewing === post.id) previewing = null;
								}}
							>
								<img
									src={post.image}
									alt=""
									loading="lazy"
									decoding="async"
									referrerpolicy="no-referrer"
									class="frame-photo absolute inset-0 h-full w-full object-cover"
								/>
								{#if previewing === post.id && post.video}
									<video
										src={post.video}
										class="absolute inset-0 h-full w-full object-cover"
										autoplay
										muted
										loop
										playsinline
										aria-hidden="true"
									></video>
								{/if}

								<!-- registration marks -->
								<span class="mark top-1.5 left-1.5 border-t border-l" aria-hidden="true"></span>
								<span class="mark top-1.5 right-1.5 border-t border-r" aria-hidden="true"></span>
								<span class="mark bottom-1.5 left-1.5 border-b border-l" aria-hidden="true"></span>
								<span class="mark right-1.5 bottom-1.5 border-r border-b" aria-hidden="true"></span>

								<span
									class="absolute top-3 left-3.5 font-mono text-[0.6rem] tracking-[0.14em] text-limestone-50/85 [text-shadow:0_1px_6px_rgb(0_0_0/0.6)]"
									aria-hidden="true">IG—{String(i + 1).padStart(2, '0')}</span
								>
								{#if post.kind !== 'image'}
									<span
										class="absolute top-2.5 right-3 inline-flex items-center gap-1 rounded-xs bg-ink-950/70 px-1.5 py-1 font-mono text-[0.6rem] tracking-[0.14em] text-limestone-50 uppercase"
										aria-hidden="true"
									>
										{#if post.kind === 'video'}<Play size={10} />{:else}<Layers size={10} />{/if}
										<span class={cx(i !== 0 && 'max-sm:sr-only')}>{KIND[post.kind]}</span>
									</span>
								{/if}

								<span
									class={cx(
										'caption absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-linear-to-t from-ink-950/95 via-ink-950/70 to-transparent p-3 pt-10 text-left',
										i === 0 && 'sm:p-5 sm:pt-16'
									)}
									aria-hidden="true"
								>
									<span class="font-mono text-[0.6rem] tracking-[0.14em] text-copper-300"
										>{sheetDate(post.timestamp)}</span
									>
									{#if words}
										<span
											class={cx(
												'text-xs leading-snug text-limestone-100',
												i === 0 ? 'line-clamp-3 sm:text-sm' : 'line-clamp-2 max-md:hidden'
											)}>{words}</span
										>
									{/if}
								</span>
							</a>
						</li>
					{/each}
				{/if}
			</ul>

			{#if phase === 'ready'}
				<div class="mt-6 flex flex-wrap items-center gap-3">
					{#if next}
						<button
							type="button"
							onclick={loadMore}
							disabled={loadingMore}
							class="inline-flex items-center gap-2 rounded-pill border border-limestone-100/25 px-5 py-3 text-sm font-semibold text-limestone-50 transition-colors hover:bg-limestone-50 hover:text-ink-900 disabled:opacity-60"
						>
							<Plus size={16} aria-hidden="true" />
							{loadingMore ? 'Loading frames…' : 'Load more frames'}
						</button>
					{/if}
					{#if profileUrl}
						<a
							href={profileUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="link-dim inline-flex items-center gap-1 px-2 py-3 text-sm font-semibold text-copper-300"
						>
							View on Instagram <ArrowUpRight size={14} aria-hidden="true" />
							<span class="sr-only">(opens in a new tab)</span>
						</a>
					{/if}
					<span class="ml-auto font-mono text-label text-limestone-400 uppercase">
						{posts.length} frames{profile?.posts ? ` of ${compact.format(profile.posts)}` : ''}
					</span>
				</div>
			{/if}
		</div>
	</section>
{/if}

<style>
	/* Photos develop from a cyanotype (blueprint) tint into full colour as they scroll in,
	   and on hover / focus. */
	.frame-photo {
		filter: grayscale(1) sepia(0.35) hue-rotate(168deg) saturate(1.8) brightness(0.78)
			contrast(1.08);
		transform: scale(1.06);
		transition:
			filter 1.4s var(--ease-out-expo) calc(var(--reveal-delay, 0ms) + 250ms),
			transform 1.6s var(--ease-out-expo);
	}
	:global([data-revealed]) .frame-photo {
		filter: none;
		transform: scale(1);
	}
	.frame:hover .frame-photo,
	.frame:focus-visible .frame-photo {
		transform: scale(1.05);
		transition-delay: 0ms;
	}

	/* Registration marks: hairline in the corners, copper and pulled in on hover. */
	.mark {
		position: absolute;
		width: 0.75rem;
		height: 0.75rem;
		border-color: rgb(244 239 230 / 0.55);
		transition:
			border-color 0.4s,
			transform 0.5s var(--ease-out-expo);
	}
	.frame:hover .mark,
	.frame:focus-visible .mark {
		border-color: var(--color-copper-400);
		transform: scale(1.35);
	}

	.caption {
		opacity: 0;
		transform: translateY(0.5rem);
		transition:
			opacity 0.35s,
			transform 0.5s var(--ease-out-expo);
	}
	.frame:hover .caption,
	.frame:focus-visible .caption {
		opacity: 1;
		transform: none;
	}
	/* Touch screens have no hover: keep the date and caption visible on the lead frame. */
	@media (hover: none) {
		li:first-child .caption {
			opacity: 1;
			transform: none;
		}
	}

	.frame-skeleton {
		border: 1px solid rgb(244 239 230 / 0.1);
		border-radius: var(--radius-xs);
		background: linear-gradient(
				110deg,
				transparent 30%,
				rgb(244 239 230 / 0.06) 50%,
				transparent 70%
			)
			0 0 / 250% 100%;
		animation: sweep 1.6s linear infinite;
	}
	@keyframes sweep {
		to {
			background-position: -250% 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.frame-photo {
			filter: none;
			transform: none;
			transition: none;
		}
		.frame-skeleton {
			animation: none;
		}
	}
</style>
