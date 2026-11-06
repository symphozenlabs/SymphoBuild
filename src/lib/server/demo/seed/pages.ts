import {
	body,
	callout,
	cta,
	feature,
	h2,
	h3,
	img,
	k,
	p,
	refs,
	seo,
	slug,
	stat,
	ul
} from './helpers.ts';
import type { SeedDoc } from './helpers.ts';

type PageInput = {
	id: string;
	title: string;
	hero: { eyebrow?: string; heading: string; intro?: string; image?: ReturnType<typeof img> };
	sections?: unknown[];
	seoTitle?: string;
	seoDescription: string;
	noIndex?: boolean;
};

const page = (i: PageInput): SeedDoc => ({
	_id: `page.${i.id}`,
	_type: 'page',
	title: i.title,
	slug: slug(i.id),
	hero: { _type: 'pageHero', ...i.hero },
	sections: (i.sections ?? []).map((s) => ({ _key: k(), ...(s as object) })),
	seo: {
		...seo(i.seoTitle ?? `${i.title} — Spacecraft Associates`, i.seoDescription),
		...(i.noIndex ? { noIndex: true } : {})
	}
});

const specGroup = (category: string, items: [string, string, string?][]) => ({
	_key: k(),
	category,
	items: items.map(([label, detail, brand]) => ({
		_key: k(),
		label,
		detail,
		...(brand ? { brand } : {})
	}))
});

export const pages: SeedDoc[] = [
	/* ── Index pages (hero + SEO for listing routes) ─────────────────────── */
	page({
		id: 'projects',
		title: 'Projects',
		hero: {
			eyebrow: 'Portfolio',
			heading: 'Addresses we have drawn, built and handed over.',
			intro:
				'Filter by status, type, location, size or budget. Every project page lists its approvals, specifications and construction progress.'
		},
		seoDescription:
			'Explore apartments, villas, gated communities, plots and commercial projects by Spacecraft Associates — upcoming, ongoing, completed and ready to move.'
	}),
	page({
		id: 'services',
		title: 'Services',
		hero: {
			eyebrow: 'What we do',
			heading: 'Seven services. One accountable team.',
			intro:
				'Engage Spacecraft Associates for a single stage or the complete journey — from land advice and architecture to approvals, construction and interiors.'
		},
		sections: [
			{
				_type: 'ctaSection',
				eyebrow: 'Not sure where to start?',
				heading: 'Tell us about your land or your plans.',
				text: 'A thirty-minute consultation is usually enough to know which services you need — and which you do not.',
				primaryCta: cta('Book a consultation', '/contact#consultation', 'primary', 'consultation'),
				secondaryCta: cta('WhatsApp us', '/contact', 'secondary', 'whatsapp')
			}
		],
		seoDescription:
			'Turnkey construction, architecture, interiors, project management, estimation, plan approvals and land advisory from Spacecraft Associates.'
	}),
	page({
		id: 'insights',
		title: 'Insights',
		hero: {
			eyebrow: 'Journal',
			heading: 'Notes from the drawing board and the site.',
			intro: 'Practical writing on construction, design and buying a home.'
		},
		seoDescription:
			'Articles on construction quality, design and homebuying from the Spacecraft Associates team.'
	}),
	page({
		id: 'gallery',
		title: 'Gallery',
		hero: {
			eyebrow: 'Visual portfolio',
			heading: 'Work, in progress and complete.',
			intro: 'Exteriors, interiors, amenities and the construction stages in between.'
		},
		seoDescription:
			'A visual portfolio of Spacecraft Associates projects — exteriors, interiors, amenities and construction progress.'
	}),

	/* ── About ────────────────────────────────────────────────────────────── */
	page({
		id: 'about',
		title: 'About',
		hero: {
			eyebrow: 'About Spacecraft Associates',
			heading: 'We believe a building should be as well documented as it is well built.',
			intro:
				'Founded in 2008 (demo), Spacecraft Associates is a design-led construction and real-estate practice based in Coimbatore.',
			image: img('office', 'Placeholder illustration of the Spacecraft Associates studio building')
		},
		sections: [
			{
				_type: 'imageTextSection',
				eyebrow: 'Our story',
				heading: 'It began with one house and a very thick file.',
				body: body(
					p(
						'Our founder’s first project was a family home. Alongside the keys, the owners received a file with every drawing, test report and invoice. They said it was the file, more than the house, that made them trust us.'
					),
					p(
						'That file became a habit, and the habit became a practice. Today every Spacecraft Associates project — an apartment tower or a single villa — is documented the same way.'
					)
				),
				image: img('interior_living', 'Placeholder illustration of a finished living room'),
				imagePosition: 'right'
			},
			{
				_type: 'featureGridSection',
				eyebrow: 'Mission & values',
				heading: 'What we hold ourselves to',
				intro:
					'Our mission is to make building and buying property feel certain. These values are how we try to earn that.',
				style: 'cards',
				features: [
					feature(
						'eye',
						'Openness',
						'Clients see what we see — drawings, costs, tests and delays.'
					),
					feature(
						'pencil-ruler',
						'Craft',
						'Details are drawn before they are built, not improvised on site.'
					),
					feature(
						'leaf',
						'Responsibility',
						'We design for climate and build to last, because the greenest building is one that does not need replacing.'
					),
					feature('handshake', 'Accountability', 'One team, one agreement, one number to call.')
				]
			},
			{
				_type: 'statsSection',
				heading: 'The practice in numbers (demo figures)',
				stats: [
					stat(18, 'Years', '+'),
					stat(1240, 'Homes delivered', '+'),
					stat(3.6, 'Million sq ft built', 'M', '', 1),
					stat(140, 'People on the team', '+')
				]
			},
			{
				_type: 'teamSection',
				eyebrow: 'Leadership',
				heading: 'The people accountable for your project',
				intro: 'Demo profiles — replace with your leadership team in Sanity Studio.',
				members: refs(['team.1', 'team.2', 'team.3', 'team.4', 'team.5'])
			},
			{
				_type: 'timelineSection',
				eyebrow: 'Milestones',
				heading: 'Eighteen years, a few turning points',
				items: [
					{
						_key: k(),
						year: '2008',
						title: 'First home',
						description: 'A single family residence — and the first quality file.'
					},
					{
						_key: k(),
						year: '2013',
						title: 'First apartment project',
						description: 'Twenty-four homes, delivered two months early.'
					},
					{
						_key: k(),
						year: '2017',
						title: 'Design studio opens',
						description: 'Architecture and interiors brought in-house.'
					},
					{
						_key: k(),
						year: '2022',
						title: '1,000th home handed over',
						description: 'At Lakeline Apartments, Singanallur.'
					},
					{
						_key: k(),
						year: '2026',
						title: 'Nine active sites',
						description: 'Across apartments, villas, plots and workplaces.'
					}
				]
			},
			{
				_type: 'featureGridSection',
				eyebrow: 'Capabilities',
				heading: 'Everything under one roof',
				style: 'list',
				features: [
					feature(
						'drafting-compass',
						'Architecture & planning',
						'In-house architects and structural consultants.'
					),
					feature('stamp', 'Approvals & liaison', 'A dedicated desk for permits and utilities.'),
					feature('construction', 'Construction', 'Own site teams, engineers and quality staff.'),
					feature('sofa', 'Interiors', 'Modular joinery and turnkey interiors.'),
					feature('land-plot', 'Land & development', 'Joint ventures and plotted developments.')
				]
			},
			{
				_type: 'certificationsSection',
				eyebrow: 'Certifications & recognition',
				heading: 'Credentials, stated carefully',
				intro:
					'Only list credentials you can evidence. Each entry below is a placeholder showing the fields available.',
				items: [
					{
						_key: k(),
						name: '[Placeholder] Quality management certification',
						issuer: 'Name of certifying body',
						year: '—',
						status: 'placeholder',
						note: 'Add the certificate number and scope, or remove this entry.'
					},
					{
						_key: k(),
						name: '[Placeholder] Industry association membership',
						issuer: 'Name of association',
						year: '—',
						status: 'placeholder'
					},
					{
						_key: k(),
						name: '[Placeholder] Design or construction award',
						issuer: 'Awarding organisation',
						year: '—',
						status: 'placeholder'
					}
				]
			},
			{
				_type: 'locationsSection',
				eyebrow: 'Where to find us',
				heading: 'Studios & site offices',
				items: [
					{
						_key: k(),
						name: 'Head office & design studio',
						address: '[Demo] 42 Race Course Road, Coimbatore 641018',
						phone: '+91 90000 00000',
						hours: 'Mon–Sat, 9:30 am – 6:30 pm'
					},
					{
						_key: k(),
						name: 'Tamarind Court site office',
						address: '[Demo] Sathy Road, Saravanampatti, Coimbatore 641035',
						hours: 'Daily, 10 am – 6 pm'
					},
					{
						_key: k(),
						name: 'Chennai liaison office',
						address: '[Demo] Address to be added',
						hours: 'By appointment'
					}
				]
			},
			{
				_type: 'ctaSection',
				heading: 'Meet the team at the studio.',
				text: 'We are happy to walk you through a live project file.',
				primaryCta: cta('Book a consultation', '/contact#consultation', 'primary', 'consultation')
			}
		],
		seoDescription:
			'The story, leadership, values and capabilities behind Spacecraft Associates, a design-led construction and real-estate practice in Coimbatore.'
	}),

	/* ── Quality & specifications ─────────────────────────────────────────── */
	page({
		id: 'quality-and-specifications',
		title: 'Quality & specifications',
		hero: {
			eyebrow: 'How we build',
			heading: 'Quality is a set of checks, not an adjective.',
			intro:
				'Our standards, materials and inspection routines — written down so you can hold us to them.',
			image: img('site_foundation', 'Placeholder illustration of foundation works')
		},
		sections: [
			{
				_type: 'featureGridSection',
				eyebrow: 'Standards',
				heading: 'Six things we never skip',
				style: 'spec',
				features: [
					feature(
						'mountain',
						'Soil investigation',
						'Every foundation is designed from a site-specific soil report.'
					),
					feature(
						'blocks',
						'Structural design',
						'Licensed structural engineers design for the applicable seismic zone and loads.'
					),
					feature(
						'droplets',
						'Waterproofing',
						'Crystalline and membrane systems with a 48-hour ponding test before tiling.'
					),
					feature(
						'leaf',
						'Sustainability',
						'Rainwater harvesting, solar provisions and daylight-first planning.'
					),
					feature(
						'hard-hat',
						'Safety',
						'Toolbox talks, PPE audits, edge protection and barricaded work zones.'
					),
					feature(
						'scan-eye',
						'Workmanship',
						'Stage inspections against written checklists, with photographic records.'
					)
				]
			},
			{
				_type: 'richTextSection',
				eyebrow: 'Structural approach',
				heading: 'Built from the ground up — and tested on the way',
				layout: 'split',
				body: body(
					p(
						'Foundations are designed from soil data rather than assumptions. Every structural pour is recorded with its location, its concrete grade and its cube test results at 7 and 28 days.'
					),
					p(
						'Reinforcement is checked by the site engineer before every pour, and mill test certificates are kept for all steel.'
					),
					callout(
						'note',
						'Design codes, seismic zones and grades differ between projects. The exact specification for each project is listed on its project page and in your agreement.'
					)
				)
			},
			{
				_type: 'specTableSection',
				eyebrow: 'Materials',
				heading: 'Standard residential specification (demo)',
				intro:
					'Brands are indicative and subject to availability; equivalents of the same grade may be used. The agreement for each project is the final reference.',
				groups: [
					specGroup('Structure', [
						[
							'Cement',
							'OPC / PPC as per structural design',
							'Leading national brands or equivalent'
						],
						['Steel', 'Fe 550D TMT reinforcement', 'Primary producers or equivalent'],
						['Concrete', 'Design-mix RMC, M25 and above']
					]),
					specGroup('Finishes', [
						['Flooring', 'Large-format vitrified tiles', 'Branded vitrified tiles'],
						[
							'Paint',
							'Acrylic emulsion inside, weatherproof emulsion outside',
							'Leading paint brands'
						],
						['Windows', 'UPVC with toughened glass and mesh']
					]),
					specGroup('Services', [
						['Wiring', 'FR copper wiring with MCB distribution', 'Branded wires & switches'],
						['Plumbing', 'CPVC / UPVC pipes, pressure-tested', 'Branded pipes'],
						['Sanitaryware', 'Wall-hung EWCs, concealed cisterns', 'Branded sanitaryware']
					])
				]
			},
			{
				_type: 'certificationsSection',
				eyebrow: 'Compliance',
				heading: 'Approvals & certifications',
				intro:
					'We do not make blanket compliance claims. Project-specific approvals are listed on each project page; organisation-level certifications, if any, are listed here with verifiable details.',
				items: [
					{
						_key: k(),
						name: '[Placeholder] Certification name',
						issuer: 'Issuing body',
						year: '—',
						status: 'placeholder',
						note: 'Replace with a real, verifiable certification — or delete.'
					}
				]
			},
			{
				_type: 'faqSection',
				heading: 'Construction questions',
				faqs: refs(['faq.construction-1', 'faq.construction-2'])
			}
		],
		seoDescription:
			'Spacecraft Associates construction standards: soil investigation, structural design, waterproofing, safety, sustainability, workmanship and material specifications.'
	}),

	/* ── For landowners ───────────────────────────────────────────────────── */
	page({
		id: 'for-landowners',
		title: 'For landowners',
		hero: {
			eyebrow: 'Joint development',
			heading: 'Your land, developed with you — not just on it.',
			intro:
				'Partner with Spacecraft Associates to turn a plot you own into homes or workplaces. We design, approve, fund and build; you share in the result.',
			image: img('palm_grid_avenue', 'Placeholder illustration of a tree-lined development')
		},
		sections: [
			{
				_type: 'featureGridSection',
				eyebrow: 'Benefits',
				heading: 'Why landowners partner with us',
				style: 'cards',
				features: [
					feature(
						'banknote',
						'No construction outlay',
						'In a typical joint development, we fund design, approvals and construction.'
					),
					feature(
						'scale',
						'Transparent share',
						'Area or revenue share modelled openly, line by line.'
					),
					feature(
						'file-check',
						'Clean paperwork',
						'Legal review, approvals and RERA handled by our teams.'
					),
					feature(
						'heart-handshake',
						'Family-friendly process',
						'We meet every co-owner and explain every clause.'
					)
				]
			},
			{
				_type: 'processSection',
				eyebrow: 'How it works',
				heading: 'From first conversation to handover',
				steps: [
					{
						_key: k(),
						title: 'Share land details',
						description: 'Tell us the location, size and ownership using the form below.',
						duration: 'Day 1'
					},
					{
						_key: k(),
						title: 'Document review',
						description: 'Our legal partners review title and encumbrance records.',
						duration: '1–2 weeks'
					},
					{
						_key: k(),
						title: 'Feasibility & proposal',
						description: 'We model what can be built and propose a share.',
						duration: '2–3 weeks'
					},
					{
						_key: k(),
						title: 'Agreement',
						description: 'A joint development agreement, reviewed by your advisor.',
						duration: 'Flexible'
					},
					{
						_key: k(),
						title: 'Design, approvals & construction',
						description: 'We build; you receive regular progress reports.',
						duration: 'Project-specific'
					},
					{
						_key: k(),
						title: 'Handover of your share',
						description: 'Your homes or proceeds, with complete documentation.'
					}
				]
			},
			{
				_type: 'formSection',
				eyebrow: 'Tell us about your land',
				heading: 'Check your land’s eligibility',
				intro:
					'Share a few details and our land team will respond within three working days. Everything you share is kept confidential.',
				formType: 'landowner'
			},
			{
				_type: 'testimonialsSection',
				heading: 'From our landowner partners',
				testimonials: refs(['testimonial.4'])
			},
			{
				_type: 'projectsSection',
				eyebrow: 'Case study',
				heading: 'Developed with landowners',
				projects: refs(['project.palm-grid-enclave'])
			},
			{
				_type: 'faqSection',
				heading: 'Landowner questions',
				faqs: refs(['faq.landowner-1', 'faq.landowner-2', 'faq.landowner-3'])
			}
		],
		seoDescription:
			'Joint development and land partnership with Spacecraft Associates: how it works, the benefits for landowners, and a simple eligibility form.'
	}),

	/* ── Buyer's guide ────────────────────────────────────────────────────── */
	page({
		id: 'buyers-guide',
		title: 'Buyer’s guide',
		hero: {
			eyebrow: 'Buyer’s guide',
			heading: 'Everything worth knowing before you buy.',
			intro:
				'Plain-language guides to buying a home or plot, the documents to ask for, loans, approvals, possession and maintenance.'
		},
		sections: [
			{ _type: 'guideListSection', heading: 'Guides' },
			{
				_type: 'faqSection',
				heading: 'Buying questions',
				faqs: refs(['faq.buying-1', 'faq.buying-2', 'faq.buying-3'])
			},
			{
				_type: 'ctaSection',
				heading: 'Prefer to ask a person?',
				text: 'Our client team answers buyer questions every day — no obligation.',
				primaryCta: cta('Book a consultation', '/contact#consultation', 'primary', 'consultation'),
				secondaryCta: cta('WhatsApp us', '/contact', 'secondary', 'whatsapp')
			}
		],
		seoDescription:
			'Guides for home and plot buyers: purchase steps, document checklist, home loans, approvals, possession and maintenance.'
	}),

	/* ── Contact ──────────────────────────────────────────────────────────── */
	page({
		id: 'contact',
		title: 'Contact',
		hero: {
			eyebrow: 'Contact',
			heading: 'Let’s talk about what you want to build.',
			intro: 'Call, message or visit the studio — or book a consultation and we will come prepared.'
		},
		sections: [
			{ _type: 'contactDetailsSection', heading: 'Studio & contact details', showMap: true },
			{
				_type: 'formSection',
				eyebrow: 'Book a consultation',
				heading: 'Book a consultation or site visit',
				intro:
					'Choose a preferred date and how you would like us to reach you. We confirm every booking personally.',
				formType: 'consultation',
				anchor: 'consultation'
			}
		],
		seoDescription:
			'Contact Spacecraft Associates — address, phone, WhatsApp, business hours, service areas and a consultation booking form.'
	}),

	/* ── Legal ────────────────────────────────────────────────────────────── */
	page({
		id: 'privacy-policy',
		title: 'Privacy policy',
		hero: {
			eyebrow: 'Legal',
			heading: 'Privacy policy',
			intro: 'Template text — have it reviewed by your legal advisor before launch.'
		},
		sections: [
			{
				_type: 'richTextSection',
				layout: 'narrow',
				body: body(
					callout(
						'warning',
						'This is placeholder policy text for the demo site. It is not legal advice.'
					),
					h2('What we collect'),
					p(
						'When you submit an enquiry we collect the details you provide — such as your name, phone number, email address, the project or service you are interested in and your message — along with technical information such as the page you submitted from and campaign parameters.'
					),
					h2('How we use it'),
					ul([
						'To respond to your enquiry and arrange consultations or site visits',
						'To send information you have requested, such as brochures',
						'To improve our website and communications'
					]),
					h2('Sharing'),
					p(
						'We do not sell your personal data. We share it only with service providers who help us operate our business, under appropriate safeguards, or where required by law.'
					),
					h2('Retention and your rights'),
					p(
						'We keep enquiry records only as long as needed for the purposes above. You can ask us to access, correct or delete your data by writing to the email address on our contact page.'
					),
					h3('Contact'),
					p('Questions about this policy can be sent to our team via the contact page.')
				)
			}
		],
		seoDescription:
			'How Spacecraft Associates collects, uses and protects personal information submitted through this website.'
	}),
	page({
		id: 'terms',
		title: 'Terms of use',
		hero: {
			eyebrow: 'Legal',
			heading: 'Terms of use',
			intro: 'Template text — have it reviewed by your legal advisor before launch.'
		},
		sections: [
			{
				_type: 'richTextSection',
				layout: 'narrow',
				body: body(
					callout('warning', 'This is placeholder text for the demo site. It is not legal advice.'),
					h2('Information on this website'),
					p(
						'Content on this website is for general information. Images, floor plans and renderings are representative. Specifications, prices and availability are subject to change and are confirmed only in a signed agreement.'
					),
					h2('No offer'),
					p(
						'Nothing on this website constitutes an offer or a contract. Please verify project approvals and registrations independently, including on the applicable RERA portal.'
					),
					h2('Intellectual property'),
					p(
						'Text, drawings and images on this website belong to Spacecraft Associates or its licensors and may not be reproduced without permission.'
					)
				)
			}
		],
		seoDescription: 'Terms governing the use of the Spacecraft Associates website.'
	}),
	page({
		id: 'thank-you',
		title: 'Thank you',
		hero: {
			eyebrow: 'Enquiry received',
			heading: 'Thank you. We’ll be in touch shortly.',
			intro: 'A member of our client team will contact you within one working day.'
		},
		sections: [
			{
				_type: 'ctaSection',
				heading: 'While you wait',
				text: 'Explore our current projects or read the buyer’s guide.',
				primaryCta: cta('Explore projects', '/projects'),
				secondaryCta: cta('Read the buyer’s guide', '/buyers-guide', 'secondary')
			}
		],
		seoDescription: 'Thank you for contacting Spacecraft Associates.',
		noIndex: true
	})
];

export const redirects: SeedDoc[] = [
	{
		_id: 'redirect.1',
		_type: 'redirect',
		source: '/our-projects',
		destination: '/projects',
		permanent: true
	},
	{
		_id: 'redirect.2',
		_type: 'redirect',
		source: '/blog',
		destination: '/insights',
		permanent: true
	}
];
