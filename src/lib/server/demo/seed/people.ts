import { body, img, p, ref } from './helpers.ts';
import type { SeedDoc } from './helpers.ts';

export const team: SeedDoc[] = [
	{
		_id: 'team.1',
		_type: 'teamMember',
		name: 'Aravind Sekar',
		role: 'Founder & Managing Director',
		leadership: true,
		order: 1,
		photo: img('portrait_1', 'Placeholder portrait for the founder'),
		bio: 'Demo profile. A civil engineer who started Spacecraft Associates with a single residential site and a belief that construction should be as well documented as it is well built.'
	},
	{
		_id: 'team.2',
		_type: 'teamMember',
		name: 'Meera Natarajan',
		role: 'Principal Architect',
		leadership: true,
		order: 2,
		photo: img('portrait_2', 'Placeholder portrait for the principal architect'),
		bio: 'Demo profile. Leads the design studio, with a focus on daylight, cross-ventilation and buildings that age gracefully.'
	},
	{
		_id: 'team.3',
		_type: 'teamMember',
		name: 'Karthik Rajan',
		role: 'Head of Construction',
		leadership: true,
		order: 3,
		photo: img('portrait_3', 'Placeholder portrait for the head of construction'),
		bio: 'Demo profile. Oversees every active site, the schedule and the engineers who keep it honest.'
	},
	{
		_id: 'team.4',
		_type: 'teamMember',
		name: 'Divya Prakash',
		role: 'Head of Quality & Safety',
		leadership: true,
		order: 4,
		photo: img('portrait_4', 'Placeholder portrait for the head of quality and safety'),
		bio: 'Demo profile. Runs stage inspections, testing and site safety audits.'
	},
	{
		_id: 'team.5',
		_type: 'teamMember',
		name: 'Nikhil Varma',
		role: 'Client Relations Lead',
		leadership: false,
		order: 5,
		photo: img('portrait_5', 'Placeholder portrait for the client relations lead'),
		bio: 'Demo profile. Your first call — and the person who makes sure you never have to chase an update.'
	}
];

export const testimonials: SeedDoc[] = [
	{
		_id: 'testimonial.1',
		_type: 'testimonial',
		quote:
			'We were shown the soil report, the cube test results and the steel invoices without asking. That is when we stopped worrying.',
		name: 'Demo client — R. & S. Iyer',
		context: 'Villa owners',
		project: ref('project.sage-residences'),
		featured: true
	},
	{
		_id: 'testimonial.2',
		_type: 'testimonial',
		quote:
			'The weekly updates were so detailed that we could follow our home being built from another country.',
		name: 'Demo client — Anand K.',
		context: 'NRI apartment buyer',
		project: ref('project.lakeline'),
		featured: true
	},
	{
		_id: 'testimonial.3',
		_type: 'testimonial',
		quote:
			'They told us plainly which approvals would take time and why. The dates they gave us were the dates we got.',
		name: 'Demo client — P. Lakshmi',
		context: 'Built on own land',
		project: ref('project.terracotta-house'),
		featured: true
	},
	{
		_id: 'testimonial.4',
		_type: 'testimonial',
		quote:
			'Our family had held the land for decades. Spacecraft Associates explained the joint-development numbers line by line before we signed.',
		name: 'Demo client — Ramasamy family',
		context: 'Landowner partner',
		featured: true
	}
];

const qa = (
	id: string,
	category: string,
	order: number,
	question: string,
	answer: string
): SeedDoc => ({
	_id: `faq.${id}`,
	_type: 'faq',
	category,
	order,
	question,
	answer: body(p(answer))
});

export const faqs: SeedDoc[] = [
	qa(
		'general-1',
		'general',
		1,
		'Which areas do you work in?',
		'We build across Coimbatore, Tiruppur, Pollachi and Erode, and take on select projects in Chennai. If your site is elsewhere, ask us — we will tell you honestly whether we can serve it well.'
	),
	qa(
		'general-2',
		'general',
		2,
		'Can I visit an ongoing site before deciding?',
		'Yes. We encourage it. Book a guided visit and an engineer will walk you through the work in progress, including parts that will later be hidden behind plaster.'
	),
	qa(
		'buying-1',
		'buying',
		1,
		'How is the price of a home calculated?',
		'Prices are based on the saleable area and include the specifications listed on the project page. Registration, stamp duty, GST where applicable and utility deposits are shown separately in your cost sheet.'
	),
	qa(
		'buying-2',
		'buying',
		2,
		'Do you help with home loans?',
		'Our projects are typically pre-approved with several leading banks and housing finance companies. Our client team can introduce you to them and help with the paperwork; the loan decision rests with the lender.'
	),
	qa(
		'buying-3',
		'buying',
		3,
		'How do I check a project’s approvals?',
		'Each project page lists its approvals and, where applicable, its RERA registration number. You can verify RERA details on the state RERA portal, and we will share copies of approval documents on request.'
	),
	qa(
		'construction-1',
		'construction',
		1,
		'How will I know construction is progressing properly?',
		'You receive a progress update with photos at every milestone, and you can visit the site by appointment. Every structural pour is logged with its test results in the project quality file.'
	),
	qa(
		'construction-2',
		'construction',
		2,
		'Can I make changes to my home’s layout?',
		'Customisation is possible up to a defined construction stage and within structural limits. Our design team will confirm feasibility and any cost impact in writing before work begins.'
	),
	qa(
		'project-1',
		'project',
		1,
		'What is included in the price?',
		'The listed price includes the home as per the published specifications, covered parking where stated and access to common amenities. Taxes, registration and deposits are listed separately in your cost sheet.'
	),
	qa(
		'project-2',
		'project',
		2,
		'When can I take possession?',
		'The target possession date is shown on the project page and in your agreement. We share progress against the schedule at every milestone, so you will know well in advance.'
	),
	qa(
		'landowner-1',
		'landowners',
		1,
		'What kind of land is suitable for a joint development?',
		'Generally, clear-title land of around 10 cents or more with good road access, in an area with residential demand. Every site is different, so we start with a document review and a feasibility study.'
	),
	qa(
		'landowner-2',
		'landowners',
		2,
		'How is the landowner’s share decided?',
		'The share depends on the land value, what can be built on it and market conditions. We present the numbers transparently — as area share, revenue share or a combination — before any agreement.'
	),
	qa(
		'landowner-3',
		'landowners',
		3,
		'Who handles approvals and construction costs in a joint venture?',
		'In a typical joint development, Spacecraft Associates funds and manages design, approvals and construction. The exact responsibilities are written into the development agreement, reviewed by your own legal advisor.'
	)
];
