<!--
	Lightweight Portable Text renderer: headings (with anchor ids for the table of
	contents), paragraphs, block quotes, bullet/number lists, strong/em/code marks,
	links, inline images and callouts.
-->
<script lang="ts">
	import Info from '@lucide/svelte/icons/info';
	import Lightbulb from '@lucide/svelte/icons/lightbulb';
	import TriangleAlert from '@lucide/svelte/icons/triangle-alert';
	import type { PortableTextBlock, SanityImage } from '$lib/types';
	import { cx, slugify } from '$lib/utils';
	import Img from './Img.svelte';

	type Props = { value: PortableTextBlock[] | null | undefined; class?: string; prose?: boolean };
	let { value, class: className = '', prose = true }: Props = $props();

	type Group =
		| { kind: 'block'; block: PortableTextBlock }
		| { kind: 'list'; type: 'bullet' | 'number'; items: PortableTextBlock[]; key: string };

	const groups = $derived.by(() => {
		const out: Group[] = [];
		for (const block of value ?? []) {
			if (block._type === 'block' && block.listItem) {
				const last = out.at(-1);
				if (last?.kind === 'list' && last.type === block.listItem) last.items.push(block);
				else out.push({ kind: 'list', type: block.listItem, items: [block], key: block._key });
			} else out.push({ kind: 'block', block });
		}
		return out;
	});

	const plain = (b: PortableTextBlock) => (b.children ?? []).map((c) => c.text).join('');
	const safeHref = (href?: string) =>
		href && /^(https?:|mailto:|tel:|\/|#)/.test(href) ? href : undefined;

	const callouts = {
		note: { icon: Info, cls: 'border-sage-500 bg-sage-200/40' },
		tip: { icon: Lightbulb, cls: 'border-copper-500 bg-copper-200/30' },
		warning: { icon: TriangleAlert, cls: 'border-warning bg-[#f3e2c0]/50' }
	} as const;
</script>

{#snippet spans(block: PortableTextBlock)}
	{#each block.children ?? [] as span (span._key)}
		{@const marks = span.marks ?? []}
		{@const link = block.markDefs?.find((d) => marks.includes(d._key) && d._type === 'link')}
		{#snippet text()}
			{#if marks.includes('strong') && marks.includes('em')}<strong><em>{span.text}</em></strong>
			{:else if marks.includes('strong')}<strong>{span.text}</strong>
			{:else if marks.includes('em')}<em>{span.text}</em>
			{:else if marks.includes('code')}<code>{span.text}</code>
			{:else}{span.text}{/if}
		{/snippet}
		{#if link && safeHref(link.href)}
			<a
				href={safeHref(link.href)}
				target={link.blank ? '_blank' : undefined}
				rel={link.blank ? 'noopener noreferrer' : undefined}>{@render text()}</a
			>
		{:else}{@render text()}{/if}
	{/each}
{/snippet}

<div class={cx(prose && 'prose-spacecraft', className)}>
	{#each groups as group, gi (group.kind === 'list' ? group.key : (group.block._key ?? gi))}
		{#if group.kind === 'list'}
			{#if group.type === 'number'}
				<ol>
					{#each group.items as item (item._key)}<li>{@render spans(item)}</li>{/each}
				</ol>
			{:else}
				<ul>
					{#each group.items as item (item._key)}<li>{@render spans(item)}</li>{/each}
				</ul>
			{/if}
		{:else}
			{@const b = group.block}
			{#if b._type === 'block'}
				{#if b.style === 'h2'}<h2 id={slugify(plain(b))}>{@render spans(b)}</h2>
				{:else if b.style === 'h3'}<h3 id={slugify(plain(b))}>{@render spans(b)}</h3>
				{:else if b.style === 'h4'}<h4>{@render spans(b)}</h4>
				{:else if b.style === 'blockquote'}<blockquote>{@render spans(b)}</blockquote>
				{:else}<p>{@render spans(b)}</p>{/if}
			{:else if b._type === 'imageWithAlt' || b._type === 'image'}
				<figure class="not-prose my-10">
					<Img
						image={b as SanityImage}
						sizes="(min-width: 1024px) 720px, 100vw"
						class="rounded-md"
					/>
					{#if b.caption}<figcaption class="mt-3 font-mono text-label text-ink-500 uppercase">
							{b.caption as string}
						</figcaption>{/if}
				</figure>
			{:else if b._type === 'callout'}
				{@const c = callouts[(b.tone as keyof typeof callouts) ?? 'note'] ?? callouts.note}
				<aside
					class={cx('not-prose my-8 flex gap-4 rounded-sm border-l-2 p-5 text-ink-800', c.cls)}
				>
					<c.icon size={20} class="mt-0.5 shrink-0" aria-hidden="true" />
					<p class="leading-relaxed">{b.text as string}</p>
				</aside>
			{/if}
		{/if}
	{/each}
</div>
