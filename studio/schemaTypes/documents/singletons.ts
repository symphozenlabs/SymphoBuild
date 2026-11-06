import { CogIcon, HomeIcon, MenuIcon, BlockElementIcon } from '../../icons';
import { defineArrayMember, defineField, defineType } from 'sanity';
import { hrefField } from '../objects/shared';

const linkItem = defineArrayMember({
	type: 'object',
	name: 'linkItem',
	fields: [
		defineField({ name: 'label', type: 'string', validation: (rule) => rule.required() }),
		hrefField('href', 'Link', true)
	],
	preview: { select: { title: 'label', subtitle: 'href' } }
});

export const siteSettings = defineType({
	name: 'siteSettings',
	title: 'Site settings',
	type: 'document',
	icon: CogIcon,
	groups: [
		{ name: 'brand', title: 'Brand', default: true },
		{ name: 'contact', title: 'Contact & location' },
		{ name: 'forms', title: 'Forms' },
		{ name: 'features', title: 'Feature switches' },
		{ name: 'seo', title: 'SEO defaults' }
	],
	fields: [
		defineField({
			name: 'siteName',
			type: 'string',
			group: 'brand',
			validation: (rule) => rule.required()
		}),
		defineField({ name: 'tagline', type: 'string', group: 'brand' }),
		defineField({
			name: 'logo',
			type: 'imageWithAlt',
			group: 'brand',
			description:
				'Optional. Without a logo the built-in Spacecraft Associates wordmark is used. SVG or transparent PNG recommended.'
		}),
		defineField({ name: 'logoText', title: 'Wordmark text', type: 'string', group: 'brand' }),
		defineField({
			name: 'demoNotice',
			title: 'Demo / announcement notice',
			type: 'string',
			group: 'brand',
			description: 'Shows a small dismissible notice on every page. Clear this field before launch.'
		}),
		defineField({
			name: 'contact',
			type: 'object',
			group: 'contact',
			fields: [
				defineField({
					name: 'phone',
					title: 'Phone (international format)',
					type: 'string',
					description: 'e.g. +919876543210 — used for tap-to-call.'
				}),
				defineField({
					name: 'phoneDisplay',
					title: 'Phone (as displayed)',
					type: 'string',
					description: 'e.g. +91 98765 43210'
				}),
				defineField({ name: 'email', type: 'string', validation: (rule) => rule.email() }),
				defineField({
					name: 'whatsapp',
					title: 'WhatsApp number',
					type: 'string',
					description: 'Digits with country code, no + or spaces, e.g. 919876543210',
					validation: (rule) => rule.regex(/^\d{10,15}$/, { name: 'digits' })
				}),
				defineField({
					name: 'whatsappMessage',
					title: 'WhatsApp pre-filled message',
					type: 'string',
					description:
						'Use {context} where the project or service name should go, e.g. "Hello, I would like to know more{context}."'
				})
			]
		}),
		defineField({
			name: 'address',
			type: 'object',
			group: 'contact',
			fields: [
				defineField({ name: 'line1', type: 'string' }),
				defineField({ name: 'line2', type: 'string' }),
				defineField({ name: 'city', type: 'string' }),
				defineField({ name: 'state', type: 'string' }),
				defineField({ name: 'postalCode', type: 'string' }),
				defineField({ name: 'country', type: 'string', initialValue: 'IN' }),
				defineField({
					name: 'lat',
					title: 'Latitude',
					type: 'number',
					description: 'For the map pin. Right-click a location in Google Maps to copy coordinates.'
				}),
				defineField({ name: 'lng', title: 'Longitude', type: 'number' })
			]
		}),
		defineField({
			name: 'businessHours',
			type: 'array',
			group: 'contact',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'hours',
					fields: [
						defineField({ name: 'days', type: 'string' }),
						defineField({ name: 'hours', type: 'string' })
					],
					preview: { select: { title: 'days', subtitle: 'hours' } }
				})
			]
		}),
		defineField({
			name: 'serviceAreas',
			type: 'array',
			group: 'contact',
			of: [defineArrayMember({ type: 'string' })],
			options: { layout: 'tags' }
		}),
		defineField({
			name: 'social',
			title: 'Social links',
			type: 'array',
			group: 'contact',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'socialLink',
					fields: [
						defineField({
							name: 'platform',
							type: 'string',
							options: { list: ['instagram', 'facebook', 'linkedin', 'youtube', 'x', 'pinterest'] }
						}),
						defineField({ name: 'url', type: 'url' })
					],
					preview: { select: { title: 'platform', subtitle: 'url' } }
				})
			]
		}),
		defineField({
			name: 'organization',
			type: 'object',
			group: 'brand',
			fields: [
				defineField({ name: 'legalName', type: 'string' }),
				defineField({ name: 'foundingYear', type: 'number' }),
				defineField({
					name: 'priceRange',
					type: 'string',
					description: 'For search engines, e.g. ₹₹₹'
				})
			]
		}),
		defineField({
			name: 'features',
			type: 'object',
			group: 'features',
			fields: [
				defineField({
					name: 'enablePlotSales',
					title: 'Show plotted developments',
					type: 'boolean',
					initialValue: true
				}),
				defineField({
					name: 'enableUnitInventory',
					title: 'Show unit availability on project pages',
					type: 'boolean',
					initialValue: true
				}),
				defineField({
					name: 'showContactDock',
					title: 'Show floating contact button (desktop)',
					type: 'boolean',
					initialValue: true
				})
			]
		}),
		defineField({
			name: 'leadForms',
			title: 'Enquiry forms',
			type: 'object',
			group: 'forms',
			fields: [
				defineField({
					name: 'consentText',
					type: 'text',
					rows: 3,
					description: 'Shown next to the consent checkbox on every form.'
				}),
				defineField({ name: 'successTitle', type: 'string' }),
				defineField({ name: 'successMessage', type: 'text', rows: 2 }),
				defineField({
					name: 'interestOptions',
					title: '"I\'m interested in" options',
					type: 'array',
					of: [defineArrayMember({ type: 'string' })]
				}),
				defineField({
					name: 'budgetOptions',
					title: 'Budget range options',
					type: 'array',
					of: [defineArrayMember({ type: 'string' })]
				})
			]
		}),
		defineField({ name: 'seo', title: 'Default SEO', type: 'seo', group: 'seo' })
	],
	preview: { prepare: () => ({ title: 'Site settings' }) }
});

export const navigation = defineType({
	name: 'navigation',
	title: 'Navigation',
	type: 'document',
	icon: MenuIcon,
	fields: [
		defineField({
			name: 'main',
			title: 'Main menu',
			type: 'array',
			validation: (rule) => rule.max(7).warning('More than 7 top-level items gets crowded'),
			of: [
				defineArrayMember({
					type: 'object',
					name: 'navItem',
					fields: [
						defineField({ name: 'label', type: 'string', validation: (rule) => rule.required() }),
						hrefField('href', 'Link', true),
						defineField({
							name: 'description',
							type: 'string',
							description: 'Shown in the dropdown panel.'
						}),
						defineField({
							name: 'children',
							title: 'Dropdown links',
							type: 'array',
							of: [linkItem]
						})
					],
					preview: {
						select: { title: 'label', subtitle: 'href', children: 'children' },
						prepare: ({ title, subtitle, children }) => ({
							title,
							subtitle: `${subtitle}${children?.length ? ` · ${children.length} sub-links` : ''}`
						})
					}
				})
			]
		}),
		defineField({ name: 'headerCta', title: 'Header button', type: 'cta' })
	],
	preview: { prepare: () => ({ title: 'Navigation' }) }
});

export const footer = defineType({
	name: 'footer',
	title: 'Footer',
	type: 'document',
	icon: BlockElementIcon,
	fields: [
		defineField({ name: 'statement', type: 'text', rows: 2 }),
		defineField({
			name: 'columns',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'footerColumn',
					fields: [
						defineField({ name: 'title', type: 'string' }),
						defineField({ name: 'links', type: 'array', of: [linkItem] })
					],
					preview: { select: { title: 'title' } }
				})
			]
		}),
		defineField({ name: 'legalLinks', type: 'array', of: [linkItem] }),
		defineField({ name: 'disclaimer', type: 'text', rows: 3 })
	],
	preview: { prepare: () => ({ title: 'Footer' }) }
});

export const homePage = defineType({
	name: 'homePage',
	title: 'Home page',
	type: 'document',
	icon: HomeIcon,
	groups: [
		{ name: 'hero', title: 'Hero', default: true },
		{ name: 'story', title: 'Process & construction film' },
		{ name: 'sections', title: 'Sections' },
		{ name: 'seo', title: 'SEO' }
	],
	fields: [
		defineField({
			name: 'hero',
			type: 'object',
			group: 'hero',
			fields: [
				defineField({ name: 'eyebrow', type: 'string' }),
				defineField({
					name: 'headline',
					type: 'string',
					validation: (rule) => rule.required().max(90),
					description: 'The last two words are set in italics.'
				}),
				defineField({ name: 'intro', type: 'text', rows: 3 }),
				defineField({ name: 'primaryCta', type: 'cta' }),
				defineField({ name: 'secondaryCta', type: 'cta' }),
				defineField({
					name: 'mediaMode',
					title: 'Background',
					type: 'string',
					initialValue: 'scene',
					options: {
						list: [
							{ title: 'Construction film (scrubs as visitors scroll)', value: 'scene' },
							{ title: 'Image', value: 'image' },
							{ title: 'Video (muted loop)', value: 'video' }
						],
						layout: 'radio'
					}
				}),
				defineField({
					name: 'image',
					type: 'imageWithAlt',
					hidden: ({ parent }) => parent?.mediaMode !== 'image'
				}),
				defineField({
					name: 'videoUrl',
					title: 'Video file URL (.mp4)',
					type: 'url',
					hidden: ({ parent }) => parent?.mediaMode !== 'video'
				}),
				defineField({
					name: 'coordinatesLabel',
					type: 'string',
					description: 'Decorative coordinates shown in the corner, e.g. "11.00° N · 76.97° E".'
				})
			]
		}),
		defineField({
			name: 'process',
			title: 'Construction process',
			type: 'object',
			group: 'story',
			description: 'Scrolling through these steps plays the construction film in the hero.',
			fields: [
				defineField({ name: 'heading', type: 'string' }),
				defineField({ name: 'intro', type: 'text', rows: 2 }),
				defineField({
					name: 'steps',
					type: 'array',
					of: [defineArrayMember({ type: 'processStep' })],
					validation: (rule) => rule.min(2).max(8)
				})
			]
		}),
		defineField({ name: 'statsHeading', type: 'string', group: 'sections' }),
		defineField({
			name: 'stats',
			title: 'Trust metrics',
			type: 'array',
			group: 'sections',
			of: [defineArrayMember({ type: 'stat' })],
			validation: (rule) => rule.max(4)
		}),
		defineField({ name: 'projectsHeading', type: 'string', group: 'sections' }),
		defineField({ name: 'projectsIntro', type: 'text', rows: 2, group: 'sections' }),
		defineField({
			name: 'featuredProjects',
			type: 'array',
			group: 'sections',
			of: [defineArrayMember({ type: 'reference', to: [{ type: 'project' }] })],
			validation: (rule) => rule.unique().max(6)
		}),
		defineField({ name: 'servicesHeading', type: 'string', group: 'sections' }),
		defineField({ name: 'servicesIntro', type: 'text', rows: 2, group: 'sections' }),
		defineField({
			name: 'pillarsHeading',
			title: '"Why us" heading',
			type: 'string',
			group: 'sections'
		}),
		defineField({ name: 'pillarsIntro', type: 'text', rows: 2, group: 'sections' }),
		defineField({
			name: 'pillars',
			title: 'Trust pillars',
			type: 'array',
			group: 'sections',
			of: [defineArrayMember({ type: 'feature' })],
			validation: (rule) => rule.max(5)
		}),
		defineField({ name: 'testimonialsHeading', type: 'string', group: 'sections' }),
		defineField({
			name: 'testimonials',
			type: 'array',
			group: 'sections',
			of: [defineArrayMember({ type: 'reference', to: [{ type: 'testimonial' }] })]
		}),
		defineField({ name: 'insightsHeading', type: 'string', group: 'sections' }),
		defineField({ name: 'insightsIntro', type: 'text', rows: 2, group: 'sections' }),
		defineField({ name: 'faqHeading', type: 'string', group: 'sections' }),
		defineField({
			name: 'faqs',
			type: 'array',
			group: 'sections',
			of: [defineArrayMember({ type: 'reference', to: [{ type: 'faq' }] })]
		}),
		defineField({
			name: 'cta',
			title: 'Closing call to action',
			type: 'object',
			group: 'sections',
			fields: [
				defineField({ name: 'eyebrow', type: 'string' }),
				defineField({ name: 'heading', type: 'string' }),
				defineField({ name: 'text', type: 'text', rows: 2 }),
				defineField({ name: 'primaryCta', type: 'cta' }),
				defineField({ name: 'secondaryCta', type: 'cta' })
			]
		}),
		defineField({ name: 'seo', type: 'seo', group: 'seo' })
	],
	preview: { prepare: () => ({ title: 'Home page' }) }
});
