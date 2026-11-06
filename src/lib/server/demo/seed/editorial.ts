import {
	body,
	callout,
	h2,
	h3,
	img,
	inlineImage,
	ol,
	p,
	quote,
	ref,
	refs,
	seo,
	slug,
	ul
} from './helpers.ts';
import type { DemoImageName, SeedDoc } from './helpers.ts';

/* ── Blog categories ──────────────────────────────────────────────────────── */
export const blogCategories: SeedDoc[] = [
	{
		_id: 'category.construction',
		_type: 'blogCategory',
		title: 'Construction',
		slug: slug('construction'),
		description: 'How buildings are made, and how to tell when they are made well.'
	},
	{
		_id: 'category.homebuying',
		_type: 'blogCategory',
		title: 'Homebuying',
		slug: slug('homebuying'),
		description: 'Practical advice for buyers and families.'
	},
	{
		_id: 'category.design',
		_type: 'blogCategory',
		title: 'Design',
		slug: slug('design'),
		description: 'Light, air, materials and the craft of planning.'
	},
	{
		_id: 'category.news',
		_type: 'blogCategory',
		title: 'Studio news',
		slug: slug('studio-news'),
		description: 'Launches, milestones and handovers.'
	}
];

type PostInput = {
	id: string;
	title: string;
	excerpt: string;
	cover: DemoImageName;
	coverAlt: string;
	categories: string[];
	author: string;
	publishedAt: string;
	featured?: boolean;
	body: unknown[];
};

const post = (i: PostInput): SeedDoc => ({
	_id: `post.${i.id}`,
	_type: 'blogPost',
	title: i.title,
	slug: slug(i.id),
	excerpt: i.excerpt,
	coverImage: img(i.cover, i.coverAlt),
	categories: refs(i.categories),
	author: ref(i.author),
	publishedAt: i.publishedAt,
	featured: i.featured ?? false,
	body: i.body,
	seo: seo(i.title, i.excerpt)
});

export const blogPosts: SeedDoc[] = [
	post({
		id: 'reading-a-cube-test-report',
		title: 'How to read a concrete cube test report',
		excerpt:
			'The single page that tells you whether the concrete in your home is as strong as it should be — and the three numbers worth checking.',
		cover: 'site_structure',
		coverAlt: 'Placeholder illustration of a concrete frame under construction',
		categories: ['category.construction'],
		author: 'team.4',
		publishedAt: '2026-09-02T09:00:00.000Z',
		featured: true,
		body: body(
			p(
				'Every time concrete is poured on a well-run site, a few samples are cast into small cubes and sent for testing. The report that comes back is one of the most useful documents you can ask your builder for.'
			),
			h2('Why cubes are tested at 7 and 28 days'),
			p(
				'Concrete keeps gaining strength for weeks after it is poured. The 7-day result is an early warning; the 28-day result is the one that is compared with the design grade.'
			),
			callout(
				'tip',
				'Ask for the report of the specific pour that formed your floor slab — a good builder can find it in minutes.'
			),
			h2('The three numbers to check'),
			ol([
				'**Design grade** — for example M25, meaning a target of 25 N/mm² at 28 days.',
				'**Individual results** — no single cube should fall far below the grade.',
				'**Average of the set** — the mean of the samples should meet or exceed the grade.'
			]),
			h3('What if a result is low?'),
			p(
				'One low cube is not automatically a failure, but it must be investigated. Engineers may test additional samples or the structure itself before deciding on any remedial action.'
			),
			h2('Where Spacecraft Associates keeps these records'),
			p(
				'Each project maintains a quality file with every pour, its location and its test results. Owners receive a copy at handover.'
			),
			quote(
				'A building’s strength is invisible once it is plastered. The paperwork is how you see it.'
			)
		)
	}),
	post({
		id: 'cross-ventilation-in-apartments',
		title: 'Designing apartments that breathe',
		excerpt:
			'Why we fight for cross-ventilation in every bedroom, and what it means for comfort and power bills in a warm climate.',
		cover: 'interior_living',
		coverAlt: 'Placeholder illustration of a naturally lit living room',
		categories: ['category.design'],
		author: 'team.2',
		publishedAt: '2026-08-12T09:00:00.000Z',
		body: body(
			p(
				'A room with windows on two sides can stay several degrees cooler than a room with a single opening. In a warm climate, that difference decides whether the air conditioner runs all afternoon.'
			),
			h2('Openings on two faces'),
			p(
				'Cross-ventilation needs an inlet and an outlet. We plan bedrooms at the corners of the floor plate, or give them a second opening onto a balcony or shaft.'
			),
			inlineImage(
				'plan_3bhk',
				'Placeholder floor plan showing windows on two sides of each bedroom',
				'Each bedroom gets openings on two faces.'
			),
			h2('Shade before glass'),
			p(
				'Deep balconies and fins shade the glazing, so the breeze arrives cool rather than carrying heat in with it.'
			),
			h2('What to look for when you buy'),
			ul([
				'Windows on two walls of each bedroom',
				'Balconies deep enough to shade the glass',
				'Kitchens with a utility balcony or exhaust shaft'
			])
		)
	}),
	post({
		id: 'first-home-checklist',
		title: 'A calm checklist for your first home purchase',
		excerpt:
			'Twelve questions to ask before you pay a booking amount — written for first-time buyers.',
		cover: 'tamarind_court',
		coverAlt: 'Placeholder illustration of an apartment building',
		categories: ['category.homebuying'],
		author: 'team.5',
		publishedAt: '2026-07-20T09:00:00.000Z',
		body: body(
			p(
				'Buying your first home is exciting and a little overwhelming. This checklist is designed to slow you down in the right places.'
			),
			h2('Before you visit'),
			ul([
				'Fix a realistic budget, including registration and interiors',
				'Check the project’s RERA registration on the state portal',
				'Read the builder’s track record of handovers'
			]),
			h2('At the site'),
			ul([
				'Ask to see the approved plan and compare it with the brochure',
				'Look at the specification sheet, not just the show home',
				'Ask how progress will be reported to you'
			]),
			h2('Before you sign'),
			ul([
				'Read the agreement with your own legal advisor',
				'Confirm the payment schedule is linked to construction milestones',
				'Get every promise in writing'
			])
		)
	}),
	post({
		id: 'waterproofing-that-lasts',
		title: 'Waterproofing that lasts: what happens before the tiles go down',
		excerpt:
			'Most leaks start in places nobody sees. Here is how we treat bathrooms, balconies and terraces — and how we test them.',
		cover: 'interior_kitchen',
		coverAlt: 'Placeholder illustration of a kitchen interior',
		categories: ['category.construction'],
		author: 'team.3',
		publishedAt: '2026-06-08T09:00:00.000Z',
		body: body(
			p(
				'Waterproofing is only as good as its weakest joint. We treat it as a system, not a product.'
			),
			h2('Sunken slabs'),
			p(
				'Bathroom slabs receive a crystalline treatment and a flexible membrane that runs up the walls before tiling.'
			),
			h2('The ponding test'),
			p(
				'Every treated area is flooded and left for 48 hours before tiling. Any seepage is fixed and the test repeated.'
			),
			h2('Terraces'),
			p(
				'Terraces get slope correction, a polymer membrane and a protective screed, with outlets sized for monsoon rain.'
			)
		)
	}),
	post({
		id: 'tamarind-court-slab-nine',
		title: 'Tamarind Court reaches slab nine',
		excerpt:
			'A milestone update from site, including how we protected the heritage tamarind trees through the structural phase.',
		cover: 'tamarind_site',
		coverAlt: 'Placeholder illustration of a tower under construction',
		categories: ['category.news'],
		author: 'team.3',
		publishedAt: '2026-08-30T09:00:00.000Z',
		body: body(
			p(
				'Tower A of Tamarind Court has reached its ninth slab on schedule. Tree protection fencing has kept the grove untouched throughout the structural works.'
			),
			h2('What is next'),
			p(
				'Masonry will continue upwards while the structure tops out, and waterproofing trials begin in the show apartment.'
			)
		)
	}),
	post({
		id: 'plot-or-apartment',
		title: 'Plot or apartment? Questions to settle before you choose',
		excerpt:
			'Freedom and land value on one side, convenience and amenities on the other. A framework for deciding.',
		cover: 'palm_grid',
		coverAlt: 'Placeholder illustration of a plotted development',
		categories: ['category.homebuying'],
		author: 'team.1',
		publishedAt: '2026-05-16T09:00:00.000Z',
		body: body(
			p(
				'There is no universally right answer — only the right answer for your family, timeline and budget.'
			),
			h2('When a plot makes sense'),
			ul([
				'You want to design your own home',
				'You can wait before building',
				'You value land ownership above amenities'
			]),
			h2('When an apartment makes sense'),
			ul([
				'You want to move in on a fixed date',
				'Security and maintenance matter more than space',
				'You prefer amenities you could not build alone'
			])
		)
	})
];

/* ── Buyer's guide ────────────────────────────────────────────────────────── */
const guide = (
	id: string,
	order: number,
	title: string,
	topic: string,
	icon: string,
	excerpt: string,
	checklist: string[],
	content: unknown[]
): SeedDoc => ({
	_id: `guide.${id}`,
	_type: 'buyerGuide',
	title,
	slug: slug(id),
	order,
	topic,
	icon,
	excerpt,
	checklist,
	body: content,
	seo: seo(`${title} — Buyer’s guide`, excerpt)
});

export const buyerGuides: SeedDoc[] = [
	guide(
		'buying-a-home-or-plot',
		1,
		'Buying a home or plot, step by step',
		'buying',
		'house',
		'From the first site visit to registration — the full sequence, in plain language.',
		[
			'Shortlist projects and check RERA registration',
			'Visit the site and review the approved plan',
			'Pay the booking amount against a receipt',
			'Sign the agreement for sale',
			'Pay milestone-linked instalments',
			'Register the sale deed'
		],
		body(
			p(
				'Buying property follows a fairly standard sequence in India, though the details vary between states and projects.'
			),
			h2('1. Shortlist and verify'),
			p(
				'Check each project’s approvals and RERA registration, and read reviews of the builder’s past handovers.'
			),
			h2('2. Book and agree'),
			p(
				'A booking amount reserves the home; the agreement for sale sets out the price, specifications, schedule and penalties.'
			),
			h2('3. Pay and register'),
			p(
				'Instalments follow construction milestones. Registration transfers legal ownership to you.'
			),
			callout(
				'note',
				'This guide is general information, not legal advice. Consult a qualified advocate for your specific purchase.'
			)
		)
	),
	guide(
		'document-checklist',
		2,
		'The document checklist',
		'documents',
		'file-text',
		'The documents to ask for, and what each one proves.',
		[
			'Title deed and parent documents',
			'Encumbrance certificate',
			'Approved building plan / layout approval',
			'RERA registration certificate',
			'Patta / revenue records',
			'Allotment letter and agreement for sale'
		],
		body(
			p(
				'Documents prove that the seller owns the land, that it is free of disputes and loans, and that the building has been approved.'
			),
			h2('Land documents'),
			ul([
				'Title deed and chain of parent documents',
				'Encumbrance certificate for 13–30 years',
				'Patta and other revenue records'
			]),
			h2('Project documents'),
			ul([
				'Approved building plan or layout approval',
				'RERA registration certificate',
				'Commencement certificate where applicable'
			])
		)
	),
	guide(
		'home-loan-process',
		3,
		'How the home-loan process works',
		'loans',
		'banknote',
		'Eligibility, sanction, disbursement and what to keep ready.',
		[
			'Identity and address proofs',
			'Income proofs for the last 2–3 years',
			'Bank statements for 6 months',
			'Property documents from the builder'
		],
		body(
			p(
				'Most buyers finance their purchase with a home loan. The lender assesses both you and the property.'
			),
			h2('Sanction'),
			p(
				'The lender checks your income and credit history and issues a sanction letter with the eligible amount.'
			),
			h2('Disbursement'),
			p(
				'For under-construction homes, loan amounts are released in stages as construction progresses.'
			)
		)
	),
	guide(
		'approval-basics',
		4,
		'Approval basics for buyers',
		'approvals',
		'stamp',
		'What planning approvals, RERA and occupancy certificates mean for you.',
		[
			'Layout or building plan approval',
			'RERA registration',
			'Occupancy / completion certificate at handover'
		],
		body(
			p(
				'Approvals confirm that a project is permitted to be built as designed, and later that it has been built that way.'
			),
			h2('RERA'),
			p(
				'The Real Estate (Regulation and Development) Act requires most projects to be registered with the state authority before they are marketed.'
			),
			h2('Occupancy certificate'),
			p(
				'Issued after completion, it confirms the building conforms to the approved plan and is fit to occupy.'
			)
		)
	),
	guide(
		'possession-process',
		5,
		'What happens at possession',
		'possession',
		'key-round',
		'Inspection, snag lists, final payments and the documents you receive.',
		[
			'Schedule a joint inspection',
			'Record snags in writing',
			'Settle final dues and deposits',
			'Collect keys, manuals and warranties'
		],
		body(
			p(
				'Possession is the moment the home becomes yours to use. A careful walkthrough now saves months of follow-up later.'
			),
			h2('The inspection'),
			p(
				'Check every tap, switch, door and window. Record anything that needs attention on a snag list signed by both sides.'
			)
		)
	),
	guide(
		'maintenance-guidance',
		6,
		'Caring for your new home',
		'maintenance',
		'hammer',
		'A simple seasonal routine that protects waterproofing, finishes and warranties.',
		[
			'Clean terrace outlets before the monsoon',
			'Check sealant around windows annually',
			'Service water pumps and tanks every six months'
		],
		body(
			p(
				'Most building problems start small. A few routine checks each year keep your home in the condition it was handed over.'
			),
			h2('Before the monsoon'),
			ul([
				'Clear terrace and balcony drain outlets',
				'Check window sealant',
				'Inspect external paint for cracks'
			])
		)
	)
];

/* ── Gallery ──────────────────────────────────────────────────────────────── */
const gi = (
	name: DemoImageName,
	title: string,
	category: string,
	alt: string,
	project?: string
): SeedDoc => ({
	_id: `gallery.${name}.${category}`,
	_type: 'galleryItem',
	title,
	category,
	image: img(name, alt),
	...(project ? { project: ref(project) } : {}),
	order: 0
});

export const galleryItems: SeedDoc[] = [
	gi(
		'tamarind_court',
		'Tamarind Court — courtyard towers',
		'exteriors',
		'Placeholder illustration of two towers around a courtyard',
		'project.tamarind-court'
	),
	gi(
		'sage_villa_dusk',
		'The Sage Residences at dusk',
		'exteriors',
		'Placeholder illustration of a villa at dusk',
		'project.sage-residences'
	),
	gi(
		'interior_living',
		'Show-home living room',
		'interiors',
		'Placeholder illustration of a living room'
	),
	gi(
		'site_structure',
		'Structure in progress',
		'construction',
		'Placeholder illustration of a building frame at dusk'
	),
	gi(
		'lakeline_pool',
		'Lakeline pool deck',
		'amenities',
		'Placeholder illustration of a pool deck',
		'project.lakeline'
	),
	gi(
		'meridian_works',
		'Meridian Works — facade study',
		'exteriors',
		'Placeholder illustration of an office facade',
		'project.meridian-works'
	),
	gi(
		'sage_interior',
		'Double-height villa living',
		'interiors',
		'Placeholder illustration of a double-height living room',
		'project.sage-residences'
	),
	gi(
		'palm_grid_avenue',
		'Palm Grid avenue',
		'plots',
		'Placeholder illustration of a tree-lined avenue',
		'project.palm-grid-enclave'
	),
	gi(
		'site_foundation',
		'Raft foundation pour',
		'construction',
		'Placeholder illustration of foundation works'
	),
	gi('amenity_clubhouse', 'Clubhouse', 'amenities', 'Placeholder illustration of a clubhouse'),
	gi(
		'terracotta_house',
		'Terracotta House by night',
		'exteriors',
		'Placeholder illustration of a brick house at night',
		'project.terracotta-house'
	),
	gi('interior_kitchen', 'Kitchen & utility', 'interiors', 'Placeholder illustration of a kitchen'),
	gi(
		'northfield',
		'Northfield plots at dusk',
		'plots',
		'Placeholder illustration of a plotted layout at dusk',
		'project.northfield'
	),
	gi(
		'meridian_lobby',
		'Office arrival lobby',
		'interiors',
		'Placeholder illustration of an office lobby',
		'project.meridian-works'
	),
	gi(
		'tamarind_site',
		'Tower A, slab nine',
		'construction',
		'Placeholder illustration of a tower under construction',
		'project.tamarind-court'
	),
	gi(
		'landscape_garden',
		'Central green',
		'amenities',
		'Placeholder illustration of a landscaped garden',
		'project.sage-residences'
	)
].map((d, i) => ({ ...d, order: i + 1 }));
