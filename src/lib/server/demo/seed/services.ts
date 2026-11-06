import { body, h2, img, k, p, refs, seo, slug, ul } from './helpers.ts';
import type { DemoImageName, SeedDoc } from './helpers.ts';

const step = (title: string, description: string, duration?: string) => ({
	_key: k(),
	title,
	description,
	...(duration ? { duration } : {})
});

type ServiceInput = {
	id: string;
	title: string;
	icon: string;
	order: number;
	summary: string;
	image: DemoImageName;
	imageAlt: string;
	body: unknown[];
	process: ReturnType<typeof step>[];
	deliverables: string[];
	projects?: string[];
	faqs?: string[];
	interest: string;
};

function service(s: ServiceInput): SeedDoc {
	return {
		_id: `service.${s.id}`,
		_type: 'service',
		title: s.title,
		slug: slug(s.id),
		icon: s.icon,
		order: s.order,
		summary: s.summary,
		heroImage: img(s.image, s.imageAlt),
		body: s.body,
		process: s.process,
		deliverables: s.deliverables,
		relatedProjects: refs(s.projects ?? []),
		faqs: refs(s.faqs ?? []),
		enquiryInterest: s.interest,
		seo: seo(`${s.title} — Spacecraft Associates`, s.summary)
	};
}

export const services: SeedDoc[] = [
	service({
		id: 'turnkey-construction',
		title: 'Turnkey construction',
		icon: 'construction',
		order: 1,
		summary:
			'Your home or building on your land — designed, approved, built and handed over under one fixed-scope agreement.',
		image: 'site_structure',
		imageAlt: 'Placeholder illustration of a building frame under construction at dusk',
		interest: 'Build on my land',
		body: body(
			p(
				'Turnkey construction means one agreement, one schedule and one team accountable for the result. We take your plot from soil test to keys, and you see every stage along the way.'
			),
			h2('What is included'),
			ul([
				'Architectural and structural design',
				'Approvals and utility connections',
				'Construction with an on-site engineer',
				'Stage-wise quality inspections and a digital progress log',
				'Handover documentation and a defect-liability period'
			]),
			p(
				'Packages are priced per square foot with a clear specification sheet, so you can compare like with like.'
			)
		),
		process: [
			step(
				'Site study & brief',
				'Survey, soil test and a conversation about how you want to live.',
				'1–2 weeks'
			),
			step(
				'Design & estimate',
				'Concept, working drawings and an itemised BOQ you sign off on.',
				'3–6 weeks'
			),
			step('Approvals', 'Our liaison desk files and tracks every permit.', '4–8 weeks'),
			step(
				'Construction',
				'Weekly updates, milestone-linked payments and stage inspections.',
				'9–14 months'
			),
			step('Handover', 'Walkthrough, snag closure, documents and warranties.', '2 weeks')
		],
		deliverables: [
			'Signed drawings set',
			'Itemised BOQ & specification sheet',
			'Approved plans',
			'Quality file with test reports',
			'Owner’s manual & warranties'
		],
		projects: ['project.terracotta-house', 'project.sage-residences'],
		faqs: ['faq.construction-1', 'faq.construction-2']
	}),
	service({
		id: 'architectural-planning',
		title: 'Architectural planning',
		icon: 'drafting-compass',
		order: 2,
		summary:
			'Climate-aware plans, elevations and 3D walkthroughs that are designed to be built — and to be lived in.',
		image: 'plan_villa',
		imageAlt: 'Placeholder architectural floor plan drawing',
		interest: 'Architecture & planning',
		body: body(
			p(
				'Good planning is mostly about light, air and movement. We orient rooms for daylight and cross-ventilation, and we design with the construction budget in view from the very first sketch.'
			)
		),
		process: [
			step('Brief & site analysis', 'Sun path, wind, setbacks and the way you use your home.'),
			step('Concept options', 'Two or three plan options with massing studies.'),
			step('Design development', 'Elevations, sections, material palette and 3D views.'),
			step(
				'Working drawings',
				'Construction-ready drawings coordinated with structure and services.'
			)
		],
		deliverables: [
			'Concept plans',
			'Elevations & sections',
			'3D walkthrough',
			'Working drawings',
			'Approval drawings'
		],
		projects: ['project.terracotta-house'],
		faqs: ['faq.construction-2']
	}),
	service({
		id: 'interior-design',
		title: 'Interior design',
		icon: 'sofa',
		order: 3,
		summary:
			'Interiors planned alongside the architecture, so joinery, lighting and services are coordinated before a wall goes up.',
		image: 'interior_living',
		imageAlt: 'Placeholder illustration of a warm, minimal living room',
		interest: 'Interior design',
		body: body(
			p(
				'We design kitchens, wardrobes, lighting and loose furniture as one composition, with 3D views and a detailed quotation before production begins.'
			)
		),
		process: [
			step('Measure & moodboard', 'On-site measurement and a material direction.'),
			step('3D design', 'Room-by-room views and joinery drawings.'),
			step('Production', 'Factory-made modular joinery with site finishing.'),
			step('Installation', 'Installation, styling and final handover.')
		],
		deliverables: [
			'Moodboard',
			'3D views',
			'Joinery drawings',
			'Itemised quotation',
			'Installation & handover'
		],
		projects: ['project.sage-residences']
	}),
	service({
		id: 'project-management',
		title: 'Project management',
		icon: 'clipboard-check',
		order: 4,
		summary:
			'Independent supervision of cost, quality and schedule for owners who are building with other contractors.',
		image: 'site_foundation',
		imageAlt: 'Placeholder illustration of foundation works on site',
		interest: 'Something else',
		body: body(
			p(
				'Our engineers act as your representative on site — checking work against drawings, certifying bills and reporting progress in plain language.'
			)
		),
		process: [
			step('Baseline', 'Review of drawings, contracts and the schedule.'),
			step('Supervision', 'Scheduled site inspections and quality checks.'),
			step('Reporting', 'Weekly reports with photos, issues and actions.')
		],
		deliverables: [
			'Baseline schedule',
			'Inspection checklists',
			'Weekly progress reports',
			'Bill certification'
		],
		faqs: ['faq.construction-1']
	}),
	service({
		id: 'cost-estimation',
		title: 'Cost estimation & BOQ',
		icon: 'calculator',
		order: 5,
		summary:
			'Itemised, drawing-based estimates so you know what the building will cost before you commit.',
		image: 'plan_3bhk',
		imageAlt: 'Placeholder architectural plan used for estimation',
		interest: 'Something else',
		body: body(
			p(
				'We prepare quantity take-offs from your drawings and price them at current market rates, with clear allowances for finishes you have not chosen yet.'
			)
		),
		process: [
			step('Drawing review', 'We check that the drawings are complete enough to estimate.'),
			step('Take-off', 'Quantities for every item of work.'),
			step('Pricing', 'Current rates with transparent allowances.')
		],
		deliverables: ['Bill of quantities', 'Cost summary', 'Specification assumptions']
	}),
	service({
		id: 'plan-approvals',
		title: 'Plan approvals',
		icon: 'stamp',
		order: 6,
		summary:
			'Preparation, filing and follow-up of planning, building and utility approvals — with a status update every week.',
		image: 'office',
		imageAlt: 'Placeholder illustration of an office building',
		interest: 'Plan approvals',
		body: body(
			p(
				'Approvals are where many projects lose months. Our liaison desk checks your drawings against current rules before filing, then tracks each application until it is issued.'
			),
			p(
				'*Approval timelines depend on the authority and are not guaranteed. We share realistic estimates at the start.*'
			)
		),
		process: [
			step('Feasibility check', 'Zoning, setbacks, FSI and road width review.'),
			step('Drawing preparation', 'Approval drawings and document checklist.'),
			step('Filing & follow-up', 'Submission and weekly status tracking.')
		],
		deliverables: [
			'Feasibility note',
			'Approval drawings',
			'Filed application',
			'Weekly status tracker'
		],
		faqs: ['faq.buying-3']
	}),
	service({
		id: 'land-advisory',
		title: 'Property & land advisory',
		icon: 'land-plot',
		order: 7,
		summary:
			'Due diligence, feasibility and development advice for landowners and buyers — including joint ventures.',
		image: 'palm_grid',
		imageAlt: 'Placeholder illustration of a plotted layout',
		interest: 'Joint venture / landowner',
		body: body(
			p(
				'We help landowners understand what their land can become, and help buyers understand what they are buying. For suitable sites, we also offer joint-development partnerships.'
			)
		),
		process: [
			step('Document review', 'Title, encumbrance and approvals check with legal partners.'),
			step('Feasibility', 'What can be built, and what it could be worth.'),
			step('Recommendation', 'Sale, joint venture or self-development — with the numbers.')
		],
		deliverables: ['Document review summary', 'Development feasibility', 'Recommendation report'],
		projects: ['project.palm-grid-enclave'],
		faqs: ['faq.landowner-1']
	})
];
