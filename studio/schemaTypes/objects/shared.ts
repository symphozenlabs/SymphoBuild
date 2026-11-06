import {
	BulbOutlineIcon,
	LaunchIcon,
	SearchIcon,
	BarChartIcon,
	InfoOutlineIcon
} from '../../icons';
import { defineArrayMember, defineField, defineType } from 'sanity';
import { ICON_NAMES } from '../../../src/lib/icon-names';

export const iconField = (name = 'icon', title = 'Icon') =>
	defineField({
		name,
		title,
		type: 'string',
		description: 'Line icon shown next to this item.',
		options: { list: ICON_NAMES.map((value) => ({ value, title: value.replace(/-/g, ' ') })) }
	});

/** Links are plain paths ("/projects", "/projects?status=ongoing") or full URLs. */
export const hrefField = (name = 'href', title = 'Link', required = false) =>
	defineField({
		name,
		title,
		type: 'string',
		description:
			'An internal path such as /projects or /services/interior-design, or a full URL (https://…).',
		validation: (rule) =>
			rule.custom((v) => {
				if (!v) return required ? 'A link is required' : true;
				return /^(\/|https?:\/\/|mailto:|tel:|#)/.test(v)
					? true
					: 'Start with /, https://, mailto: or tel:';
			})
	});

export const seo = defineType({
	name: 'seo',
	title: 'SEO & sharing',
	type: 'object',
	icon: SearchIcon,
	options: { collapsible: true, collapsed: true },
	fields: [
		defineField({
			name: 'title',
			title: 'Meta title',
			type: 'string',
			description: 'Shown in search results and browser tabs. Aim for 50–60 characters.',
			validation: (rule) => rule.max(70).warning('Long titles are truncated in search results')
		}),
		defineField({
			name: 'description',
			title: 'Meta description',
			type: 'text',
			rows: 3,
			description: 'A persuasive summary of the page, 120–160 characters.',
			validation: (rule) =>
				rule.max(170).warning('Long descriptions are truncated in search results')
		}),
		defineField({
			name: 'image',
			title: 'Share image',
			type: 'imageWithAlt',
			description: 'Used when the page is shared on WhatsApp, LinkedIn, etc. 1200 × 630 works best.'
		}),
		defineField({
			name: 'noIndex',
			title: 'Hide from search engines',
			type: 'boolean',
			initialValue: false
		}),
		defineField({
			name: 'canonical',
			title: 'Canonical URL override',
			type: 'url',
			description: 'Only set this if the page is duplicated elsewhere.'
		})
	]
});

export const cta = defineType({
	name: 'cta',
	title: 'Call to action',
	type: 'object',
	icon: LaunchIcon,
	fields: [
		defineField({
			name: 'label',
			title: 'Button label',
			type: 'string',
			validation: (rule) => rule.required().max(40)
		}),
		defineField({
			name: 'action',
			title: 'What happens on click',
			type: 'string',
			initialValue: 'link',
			options: {
				list: [
					{ title: 'Go to a page / URL', value: 'link' },
					{ title: 'Open the consultation booking form', value: 'consultation' },
					{ title: 'Open WhatsApp with a pre-filled message', value: 'whatsapp' }
				],
				layout: 'radio'
			}
		}),
		{
			...hrefField(),
			hidden: ({ parent }: { parent?: { action?: string } }) => parent?.action === 'whatsapp'
		},
		defineField({
			name: 'variant',
			title: 'Style',
			type: 'string',
			initialValue: 'primary',
			options: { list: ['primary', 'secondary', 'ghost'], layout: 'radio', direction: 'horizontal' }
		})
	],
	preview: { select: { title: 'label', subtitle: 'action' } }
});

export const stat = defineType({
	name: 'stat',
	title: 'Statistic',
	type: 'object',
	icon: BarChartIcon,
	fields: [
		defineField({
			name: 'value',
			type: 'number',
			description: 'The number that counts up, e.g. 1240 or 3.6',
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'decimals',
			type: 'number',
			initialValue: 0,
			validation: (rule) => rule.min(0).max(2)
		}),
		defineField({ name: 'prefix', type: 'string', description: 'e.g. ₹' }),
		defineField({ name: 'suffix', type: 'string', description: 'e.g. +, M, %' }),
		defineField({ name: 'label', type: 'string', validation: (rule) => rule.required() })
	],
	preview: {
		select: { value: 'value', suffix: 'suffix', label: 'label' },
		prepare: ({ value, suffix, label }) => ({
			title: `${value ?? ''}${suffix ?? ''}`,
			subtitle: label
		})
	}
});

export const feature = defineType({
	name: 'feature',
	title: 'Feature',
	type: 'object',
	icon: BulbOutlineIcon,
	fields: [
		iconField(),
		defineField({ name: 'title', type: 'string', validation: (rule) => rule.required() }),
		defineField({ name: 'description', type: 'text', rows: 3 })
	],
	preview: { select: { title: 'title', subtitle: 'description' } }
});

export const processStep = defineType({
	name: 'processStep',
	title: 'Process step',
	type: 'object',
	fields: [
		defineField({ name: 'title', type: 'string', validation: (rule) => rule.required() }),
		defineField({ name: 'duration', type: 'string', description: 'e.g. "2–4 weeks"' }),
		defineField({ name: 'description', type: 'text', rows: 3 }),
		defineField({
			name: 'stage',
			title: 'Construction film stage',
			type: 'string',
			description:
				'Home page only: which part of the construction film plays while this step is on screen.',
			options: {
				list: [
					{ title: 'Design (drawings on the site table)', value: 'design' },
					{ title: 'Approvals (plot marked out)', value: 'approvals' },
					{ title: 'Foundation (excavation & raft)', value: 'foundation' },
					{ title: 'Structure (foundation to full frame)', value: 'structure' },
					{ title: 'Envelope (glazing & fins)', value: 'envelope' },
					{ title: 'Finishes (landscape & lights)', value: 'finishes' },
					{ title: 'Handover (blue-hour reveal)', value: 'handover' }
				]
			}
		})
	],
	preview: { select: { title: 'title', subtitle: 'duration' } }
});

export const specGroup = defineType({
	name: 'specGroup',
	title: 'Specification group',
	type: 'object',
	fields: [
		defineField({
			name: 'category',
			type: 'string',
			description: 'e.g. Structure, Flooring, Electrical',
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'items',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'specItem',
					fields: [
						defineField({ name: 'label', type: 'string', validation: (rule) => rule.required() }),
						defineField({
							name: 'detail',
							type: 'text',
							rows: 2,
							validation: (rule) => rule.required()
						}),
						defineField({
							name: 'brand',
							title: 'Brand / make (optional)',
							type: 'string',
							description: 'Indicate "or equivalent" where brands may change.'
						})
					],
					preview: { select: { title: 'label', subtitle: 'detail' } }
				})
			]
		})
	],
	preview: {
		select: { title: 'category', items: 'items' },
		prepare: ({ title, items }) => ({ title, subtitle: `${items?.length ?? 0} items` })
	}
});

export const callout = defineType({
	name: 'callout',
	title: 'Callout',
	type: 'object',
	icon: InfoOutlineIcon,
	fields: [
		defineField({
			name: 'tone',
			type: 'string',
			initialValue: 'note',
			options: { list: ['note', 'tip', 'warning'], layout: 'radio', direction: 'horizontal' }
		}),
		defineField({ name: 'text', type: 'text', rows: 3, validation: (rule) => rule.required() })
	],
	preview: { select: { title: 'text', subtitle: 'tone' } }
});

/** Rich text used for articles, overviews and page copy. */
export const portableText = defineType({
	name: 'portableText',
	title: 'Rich text',
	type: 'array',
	of: [
		defineArrayMember({
			type: 'block',
			styles: [
				{ title: 'Paragraph', value: 'normal' },
				{ title: 'Heading 2', value: 'h2' },
				{ title: 'Heading 3', value: 'h3' },
				{ title: 'Heading 4', value: 'h4' },
				{ title: 'Quote', value: 'blockquote' }
			],
			lists: [
				{ title: 'Bullet', value: 'bullet' },
				{ title: 'Numbered', value: 'number' }
			],
			marks: {
				decorators: [
					{ title: 'Bold', value: 'strong' },
					{ title: 'Italic', value: 'em' }
				],
				annotations: [
					{
						name: 'link',
						type: 'object',
						title: 'Link',
						fields: [
							hrefField('href', 'URL or path'),
							defineField({
								name: 'blank',
								title: 'Open in new tab',
								type: 'boolean',
								initialValue: false
							})
						]
					}
				]
			}
		}),
		defineArrayMember({ type: 'imageWithAlt' }),
		defineArrayMember({ type: 'callout' })
	]
});

/** Paragraph-only rich text, e.g. FAQ answers. */
export const simplePortableText = defineType({
	name: 'simplePortableText',
	title: 'Simple rich text',
	type: 'array',
	of: [
		defineArrayMember({
			type: 'block',
			styles: [{ title: 'Paragraph', value: 'normal' }],
			lists: [{ title: 'Bullet', value: 'bullet' }],
			marks: {
				decorators: [
					{ title: 'Bold', value: 'strong' },
					{ title: 'Italic', value: 'em' }
				],
				annotations: [
					{
						name: 'link',
						type: 'object',
						title: 'Link',
						fields: [hrefField('href', 'URL or path')]
					}
				]
			}
		})
	]
});

export const pageHero = defineType({
	name: 'pageHero',
	title: 'Page header',
	type: 'object',
	fields: [
		defineField({ name: 'eyebrow', type: 'string', description: 'Small label above the heading.' }),
		defineField({
			name: 'heading',
			type: 'string',
			validation: (rule) => rule.required().max(120)
		}),
		defineField({ name: 'intro', type: 'text', rows: 3 }),
		defineField({
			name: 'image',
			type: 'imageWithAlt',
			description: 'Optional wide image below the header.'
		})
	]
});
