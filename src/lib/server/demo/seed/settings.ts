import { cta, img, k, seo, stat, feature, refs } from './helpers.ts';
import type { SeedDoc } from './helpers.ts';

export const siteSettings: SeedDoc = {
	_id: 'siteSettings',
	_type: 'siteSettings',
	siteName: 'Spacecraft Associates',
	tagline: 'Design-led construction & real estate',
	demoNotice:
		'Demo content — every word, figure and image here is a placeholder to be replaced in Sanity Studio before launch.',
	logoText: 'Spacecraft Associates',
	contact: {
		phone: '+919000000000',
		phoneDisplay: '+91 90000 00000',
		email: 'hello@spacecraftassociates.example',
		whatsapp: '919000000000',
		whatsappMessage:
			'Hello Spacecraft Associates, I would like to know more{context}. Please get in touch.'
	},
	address: {
		line1: '[Demo] 42 Race Course Road',
		line2: 'Near Arts College Junction',
		city: 'Coimbatore',
		state: 'Tamil Nadu',
		postalCode: '641018',
		country: 'IN',
		lat: 11.0003,
		lng: 76.9748
	},
	businessHours: [
		{ _key: k(), days: 'Monday – Saturday', hours: '9:30 am – 6:30 pm' },
		{ _key: k(), days: 'Sunday', hours: 'Site visits by appointment' }
	],
	serviceAreas: ['Coimbatore', 'Tiruppur', 'Pollachi', 'Erode', 'Chennai (select projects)'],
	social: [
		{ _key: k(), platform: 'instagram', url: 'https://www.instagram.com/' },
		{ _key: k(), platform: 'linkedin', url: 'https://www.linkedin.com/' },
		{ _key: k(), platform: 'youtube', url: 'https://www.youtube.com/' },
		{ _key: k(), platform: 'facebook', url: 'https://www.facebook.com/' }
	],
	organization: {
		legalName: 'Spacecraft Associates Private Limited (demo name)',
		foundingYear: 2008,
		priceRange: '₹₹₹'
	},
	features: { enablePlotSales: true, enableUnitInventory: true, showContactDock: true },
	leadForms: {
		consentText:
			'I agree to be contacted by Spacecraft Associates by phone, WhatsApp or email about this enquiry, and I have read the privacy policy.',
		successTitle: 'Thank you — your enquiry is with us.',
		successMessage:
			'A member of our client team will call you within one working day. If it is urgent, message us on WhatsApp.',
		interestOptions: [
			'Apartment',
			'Villa / independent house',
			'Plot',
			'Commercial space',
			'Build on my land',
			'Architecture & planning',
			'Interior design',
			'Plan approvals',
			'Joint venture / landowner',
			'Something else'
		],
		budgetOptions: [
			'Under ₹50 lakh',
			'₹50 lakh – ₹1 crore',
			'₹1 – ₹2 crore',
			'₹2 – ₹5 crore',
			'Above ₹5 crore',
			'Not decided yet'
		]
	},
	seo: {
		...seo(
			'Spacecraft Associates — Design-led construction & real estate',
			'Apartments, villas, plots and commercial spaces designed, approved and built by one accountable team. Book a consultation or a site visit with Spacecraft Associates.'
		),
		image: img(
			'og_default',
			'Illustrated residential tower at dusk — Spacecraft Associates placeholder share image'
		)
	}
};

export const navigation: SeedDoc = {
	_id: 'navigation',
	_type: 'navigation',
	main: [
		{
			_key: k(),
			label: 'Projects',
			href: '/projects',
			description: 'Apartments, villas, plots and workplaces',
			children: [
				{ _key: k(), label: 'Ongoing projects', href: '/projects?status=ongoing' },
				{ _key: k(), label: 'Ready to move', href: '/projects?status=ready' },
				{ _key: k(), label: 'Upcoming launches', href: '/projects?status=upcoming' },
				{ _key: k(), label: 'Plotted developments', href: '/projects?type=plotted' }
			]
		},
		{
			_key: k(),
			label: 'Services',
			href: '/services',
			description: 'Design, approvals, construction and advisory',
			children: [
				{ _key: k(), label: 'Turnkey construction', href: '/services/turnkey-construction' },
				{ _key: k(), label: 'Architectural planning', href: '/services/architectural-planning' },
				{ _key: k(), label: 'Interior design', href: '/services/interior-design' },
				{ _key: k(), label: 'Plan approvals', href: '/services/plan-approvals' },
				{ _key: k(), label: 'All services', href: '/services' }
			]
		},
		{
			_key: k(),
			label: 'Company',
			href: '/about',
			description: 'Who we are and how we build',
			children: [
				{ _key: k(), label: 'About Spacecraft Associates', href: '/about' },
				{ _key: k(), label: 'Quality & specifications', href: '/quality-and-specifications' },
				{ _key: k(), label: 'For landowners', href: '/for-landowners' },
				{ _key: k(), label: 'Gallery', href: '/gallery' }
			]
		},
		{
			_key: k(),
			label: 'Resources',
			href: '/insights',
			description: 'Guides and notes for buyers',
			children: [
				{ _key: k(), label: 'Insights', href: '/insights' },
				{ _key: k(), label: "Buyer's guide", href: '/buyers-guide' }
			]
		},
		{ _key: k(), label: 'Contact', href: '/contact' }
	],
	headerCta: cta('Book a consultation', '/contact#consultation', 'primary', 'consultation')
};

export const footer: SeedDoc = {
	_id: 'footer',
	_type: 'footer',
	statement:
		'Buildings drawn with care, built with conviction, and handed over with every document in order.',
	columns: [
		{
			_key: k(),
			title: 'Explore',
			links: [
				{ _key: k(), label: 'Projects', href: '/projects' },
				{ _key: k(), label: 'Services', href: '/services' },
				{ _key: k(), label: 'Gallery', href: '/gallery' },
				{ _key: k(), label: 'Insights', href: '/insights' }
			]
		},
		{
			_key: k(),
			title: 'Company',
			links: [
				{ _key: k(), label: 'About', href: '/about' },
				{ _key: k(), label: 'Quality & specifications', href: '/quality-and-specifications' },
				{ _key: k(), label: 'For landowners', href: '/for-landowners' },
				{ _key: k(), label: "Buyer's guide", href: '/buyers-guide' },
				{ _key: k(), label: 'Contact', href: '/contact' }
			]
		}
	],
	legalLinks: [
		{ _key: k(), label: 'Privacy policy', href: '/privacy-policy' },
		{ _key: k(), label: 'Terms of use', href: '/terms' }
	],
	disclaimer:
		'Images, plans and renderings are representative and for illustration only. Project approval and RERA registration numbers are listed on each project page. Prices exclude registration, stamp duty and applicable taxes unless stated.'
};

export const homePage: SeedDoc = {
	_id: 'homePage',
	_type: 'homePage',
	hero: {
		eyebrow: 'Design-led builders · Western Tamil Nadu',
		headline: 'Homes drawn with intent, built without shortcuts.',
		intro:
			'Spacecraft Associates designs, approves and constructs apartments, villas and workplaces with one accountable team — from the first sketch on the site to the last key in your hand.',
		primaryCta: cta('Explore projects', '/projects', 'primary'),
		secondaryCta: cta('Book a consultation', '/contact#consultation', 'secondary', 'consultation'),
		mediaMode: 'scene',
		image: img('hero_tower', 'Placeholder illustration of a mid-rise residential tower at dusk'),
		coordinatesLabel: '11.0003° N · 76.9748° E'
	},
	statsHeading: 'A practice measured in handovers, not hoardings.',
	stats: [
		stat(18, 'Years of practice', '+'),
		stat(1240, 'Homes delivered', '+'),
		stat(3.6, 'Million sq ft built', 'M', '', 1),
		stat(9, 'Active projects on site')
	],
	projectsHeading: 'Selected addresses',
	projectsIntro:
		'Each project is planned around its street, its light and the people who will live there — then documented from soil report to handover file.',
	featuredProjects: refs([
		'project.tamarind-court',
		'project.sage-residences',
		'project.meridian-works',
		'project.palm-grid-enclave'
	]),
	servicesHeading: 'One studio, every stage of the build.',
	servicesIntro:
		'Engage us for a single service or the entire journey. Either way, you deal with one team that carries responsibility across design, approvals and construction.',
	pillarsHeading: 'Why owners choose Spacecraft Associates',
	pillarsIntro:
		'Five commitments written into every agreement — and reviewed at every site meeting.',
	pillars: [
		feature(
			'shield-check',
			'Quality you can inspect',
			'Stage-wise inspections, cube-test records and a quality file handed to every owner at possession.'
		),
		feature(
			'eye',
			'Transparent from the first estimate',
			'Itemised BOQs, clearly scoped packages and a progress log you can open any day — no surprise line items at handover.'
		),
		feature(
			'file-check',
			'Approvals handled end-to-end',
			'Our liaison desk prepares, files and follows up planning, building and utility approvals so paperwork never stalls the site.'
		),
		feature(
			'hard-hat',
			'Safety as a site culture',
			'Daily toolbox talks, PPE audits and barricaded work zones — on every site, for every crew.'
		),
		feature(
			'calendar-check',
			'Delivery on a published schedule',
			'Milestone-linked schedules shared at signing, reviewed fortnightly and reported honestly — including when weather intervenes.'
		)
	],
	process: {
		heading: 'From drawing board to door key.',
		intro:
			'Scroll through the six stages every Spacecraft Associates project moves through. The same team, the same file, from the first line to the final walkthrough.',
		steps: [
			{
				_key: k(),
				stage: 'design',
				title: 'Discover & design',
				duration: '2–4 weeks',
				description:
					'We study the land, the brief and the budget, then develop concept plans, elevations and a walkthrough you can react to.'
			},
			{
				_key: k(),
				stage: 'approvals',
				title: 'Approvals & estimation',
				duration: '4–10 weeks',
				description:
					'Working drawings, structural design and an itemised BOQ are frozen while our liaison desk files and tracks every approval.'
			},
			{
				_key: k(),
				stage: 'structure',
				title: 'Foundation & structure',
				duration: '4–9 months',
				description:
					'Soil-tested foundations, RCC frames and slabs rise under daily engineer supervision, with every pour logged and cube-tested.'
			},
			{
				_key: k(),
				stage: 'envelope',
				title: 'Envelope & services',
				duration: '3–5 months',
				description:
					'Masonry, waterproofing, windows, plumbing and electrical systems close in the building — and are pressure- and load-tested before they are hidden.'
			},
			{
				_key: k(),
				stage: 'finishes',
				title: 'Finishes & quality audit',
				duration: '2–4 months',
				description:
					'Flooring, joinery, paint and landscape are completed, then checked room by room against a structured snag list.'
			},
			{
				_key: k(),
				stage: 'handover',
				title: 'Handover & aftercare',
				duration: 'Ongoing',
				description:
					"Keys, approvals, warranties and an owner's manual — backed by a defect-liability programme with a named contact."
			}
		]
	},
	testimonialsHeading: 'In their words',
	testimonials: refs(['testimonial.1', 'testimonial.2', 'testimonial.3', 'testimonial.4']),
	insightsHeading: 'Notes from the site',
	insightsIntro:
		'Practical writing on building, buying and owning — from the people doing the work.',
	faqHeading: 'Questions we hear every week',
	faqs: refs([
		'faq.general-1',
		'faq.buying-1',
		'faq.construction-1',
		'faq.buying-2',
		'faq.general-2'
	]),
	cta: {
		eyebrow: 'Site visits every day except Sunday',
		heading: 'Walk the site before you sign anything.',
		text: 'Book a consultation at our studio or a guided visit to any ongoing project. We will bring the drawings, the schedule and straight answers.',
		primaryCta: cta('Book a site visit', '/contact#consultation', 'primary', 'consultation'),
		secondaryCta: cta('Chat on WhatsApp', '/contact', 'secondary', 'whatsapp')
	},
	seo: seo(
		'Spacecraft Associates — Design-led construction & real estate in Coimbatore',
		'Apartments, villas, plots and commercial spaces designed, approved and built by one accountable team. Explore projects or book a site visit.'
	)
};
