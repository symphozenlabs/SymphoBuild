import { body, file, h3, img, k, p, refs, seo, slug } from './helpers.ts';
import type { DemoImageName, SeedDoc } from './helpers.ts';

const fact = (label: string, value: string) => ({ _key: k(), label, value });
const amenity = (icon: string, label: string) => ({ _key: k(), icon, label });
const near = (place: string, distance: string) => ({ _key: k(), place, distance });
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
const g = (name: DemoImageName, alt: string, caption?: string) => ({
	...img(name, alt, caption),
	_key: k()
});

const residentialSpecs = () => [
	specGroup('Structure', [
		[
			'Frame',
			'RCC framed structure designed by a licensed structural engineer for Seismic Zone III'
		],
		[
			'Concrete',
			'Design-mix concrete, M25 and above, from an approved RMC plant',
			'RMC plant — to be confirmed'
		],
		[
			'Reinforcement',
			'Fe 550D TMT bars with mill test certificates',
			'Leading primary producer or equivalent'
		]
	]),
	specGroup('Walls & waterproofing', [
		['Masonry', '200 mm external / 100 mm internal solid block or AAC walls'],
		[
			'Waterproofing',
			'Crystalline treatment in sunken slabs, polymer membrane on terraces, 48-hour ponding test'
		],
		['Plaster', 'Double-coat external plaster with waterproofing admixture']
	]),
	specGroup('Flooring', [
		['Living & bedrooms', '800 × 800 mm vitrified tiles', 'Branded vitrified tiles or equivalent'],
		['Bathrooms', 'Anti-skid ceramic tiles; wall dado up to 7 ft'],
		['Balconies', 'Matte anti-skid tiles']
	]),
	specGroup('Doors & windows', [
		['Main door', 'Teak-frame door with veneered shutter and digital lock provision'],
		['Internal doors', 'Hardwood frames with flush shutters'],
		['Windows', 'UPVC sliding windows with mosquito mesh and toughened glass']
	]),
	specGroup('Electrical & plumbing', [
		['Wiring', 'Concealed FR copper wiring with modular switches', 'Branded modular switches'],
		['Backup', 'Power backup for common areas and select points in each home'],
		[
			'Sanitaryware',
			'Wall-hung EWCs with concealed cisterns',
			'Branded sanitaryware or equivalent'
		],
		['CP fittings', 'Chrome-plated fittings with single-lever diverters']
	])
];

const plotSpecs = () => [
	specGroup('Infrastructure', [
		['Roads', 'Blacktop internal roads, 30 ft and 40 ft wide, with kerbs'],
		['Drainage', 'Covered storm-water drains along every road'],
		['Water', 'Individual water connection points to each plot'],
		['Power', 'Underground electrical cabling with streetlights']
	]),
	specGroup('Community', [
		['Boundary', 'Compound wall with a gated, staffed entry'],
		['Open space', 'Landscaped park and children’s play area'],
		['Trees', 'Avenue planting of native shade trees']
	])
];

type ProjectInput = {
	id: string;
	title: string;
	status: 'upcoming' | 'ongoing' | 'completed' | 'ready';
	propertyType: 'apartment' | 'villa' | 'gatedCommunity' | 'commercial' | 'plotted';
	featured?: boolean;
	order: number;
	tagline: string;
	locality: string;
	city: string;
	address: string;
	lat: number;
	lng: number;
	cover: DemoImageName;
	coverAlt: string;
	[key: string]: unknown;
};

function project(input: ProjectInput): SeedDoc {
	const { id, locality, city, address, lat, lng, cover, coverAlt, ...rest } = input;
	return {
		_id: `project.${id}`,
		_type: 'project',
		slug: slug(id),
		location: { locality, city, address, lat, lng },
		coverImage: img(cover, coverAlt),
		...rest,
		seo: seo(
			`${input.title} — ${locality}, ${city}`,
			`${input.tagline} Explore plans, specifications, approvals and construction progress for ${input.title} by Spacecraft Associates.`
		)
	};
}

export const projects: SeedDoc[] = [
	project({
		id: 'tamarind-court',
		title: 'Tamarind Court',
		status: 'ongoing',
		propertyType: 'apartment',
		featured: true,
		order: 1,
		tagline:
			'Two courtyard towers of 2 and 3 BHK homes, planned around a century-old tamarind grove.',
		locality: 'Saravanampatti',
		city: 'Coimbatore',
		address: '[Demo] Sathy Road, Saravanampatti, Coimbatore 641035',
		lat: 11.0784,
		lng: 76.9983,
		cover: 'tamarind_court',
		coverAlt: 'Placeholder illustration of two residential towers around a green courtyard',
		gallery: [
			g(
				'tamarind_court_dusk',
				'Placeholder illustration of the towers lit at dusk',
				'Courtyard elevation at dusk'
			),
			g(
				'interior_living',
				'Placeholder illustration of a bright living room with tall windows',
				'Show-home living room'
			),
			g(
				'interior_kitchen',
				'Placeholder illustration of a modular kitchen',
				'Kitchen with utility balcony'
			),
			g('lakeline_pool', 'Placeholder illustration of a rooftop lap pool', 'Rooftop lap pool'),
			g(
				'tamarind_site',
				'Placeholder illustration of the tower under construction',
				'Site progress, slab 9'
			)
		],
		overview: body(
			p(
				'Tamarind Court keeps the grove that gave the site its name. The two towers step back from the trees to form a shaded central courtyard, so every home looks onto green rather than a neighbour’s wall.'
			),
			p(
				'Homes are planned with **cross-ventilation in every bedroom**, deep balconies that shade the glazing, and utility balconies that keep the kitchen clutter out of sight.'
			),
			h3('Designed for the long, bright afternoons'),
			p(
				'West-facing walls are kept largely solid, and the courtyard is oriented to pull the evening breeze through the lower floors.'
			)
		),
		keyFacts: [
			fact('Land area', '2.4 acres'),
			fact('Towers', '2 × G + 12'),
			fact('Homes', '186'),
			fact('Open space', '68%'),
			fact('Target possession', 'December 2027')
		],
		bedrooms: [2, 3],
		areaRange: { min: 1085, max: 1640 },
		priceDisplay: '₹68 L – ₹1.24 Cr',
		priceFrom: 6800000,
		priceTo: 12400000,
		highlights: [
			'Century-old tamarind grove preserved as the central courtyard',
			'No two homes share a common wall across the corridor',
			'Rooftop lap pool, sky garden and co-working lounge',
			'Rainwater harvesting and treated-water reuse for landscaping'
		],
		amenities: [
			amenity('waves-ladder', 'Rooftop lap pool'),
			amenity('dumbbell', 'Fitness studio'),
			amenity('trees', 'Courtyard grove'),
			amenity('baby', 'Children’s play court'),
			amenity('wifi', 'Co-working lounge'),
			amenity('cctv', '24/7 security & CCTV'),
			amenity('zap', 'EV charging bays'),
			amenity('recycle', 'Water recycling')
		],
		specifications: residentialSpecs(),
		units: [
			{
				_key: k(),
				name: '2 BHK — Type A',
				bedrooms: 2,
				carpetArea: 760,
				builtUpArea: 1085,
				priceLabel: '₹68 L onwards',
				availability: 'available',
				unitsAvailable: 21,
				totalUnits: 72,
				floorPlan: img('plan_2bhk', 'Placeholder floor plan of a two-bedroom apartment')
			},
			{
				_key: k(),
				name: '3 BHK — Type B',
				bedrooms: 3,
				carpetArea: 1010,
				builtUpArea: 1420,
				priceLabel: '₹94 L onwards',
				availability: 'limited',
				unitsAvailable: 6,
				totalUnits: 78,
				floorPlan: img('plan_3bhk', 'Placeholder floor plan of a three-bedroom apartment')
			},
			{
				_key: k(),
				name: '3 BHK — Corner',
				bedrooms: 3,
				carpetArea: 1160,
				builtUpArea: 1640,
				priceLabel: '₹1.18 Cr onwards',
				availability: 'soldOut',
				unitsAvailable: 0,
				totalUnits: 36,
				floorPlan: img('plan_3bhk', 'Placeholder floor plan of a three-bedroom corner apartment')
			}
		],
		showInventory: true,
		approvals: [
			{
				_key: k(),
				authority: 'Local planning authority — planning permit',
				reference: '[Replace with permit no.]',
				status: 'approved'
			},
			{
				_key: k(),
				authority: 'Building permit',
				reference: '[Replace with permit no.]',
				status: 'approved'
			},
			{ _key: k(), authority: 'Fire NOC', reference: '[Replace with NOC no.]', status: 'applied' }
		],
		rera: {
			number: '[Demo] TN/00/Building/0000/2025',
			website: 'https://rera.tn.gov.in/'
		},
		connectivity: [
			near('Sathy Road', '450 m'),
			near('IT park cluster', '1.8 km'),
			near('International school', '2.2 km'),
			near('Multi-speciality hospital', '3.5 km'),
			near('Coimbatore Junction', '14 km')
		],
		brochure: file('brochure_sample', 'Tamarind Court — project brochure'),
		faqs: refs(['faq.project-1', 'faq.project-2', 'faq.buying-2']),
		relatedProjects: refs(['project.lakeline', 'project.sage-residences'])
	}),
	project({
		id: 'sage-residences',
		title: 'The Sage Residences',
		status: 'ready',
		propertyType: 'gatedCommunity',
		featured: true,
		order: 2,
		tagline:
			'Forty-two courtyard villas in a gated, tree-lined community at the foot of the hills.',
		locality: 'Vadavalli',
		city: 'Coimbatore',
		address: '[Demo] Maruthamalai Road, Vadavalli, Coimbatore 641041',
		lat: 11.0247,
		lng: 76.9001,
		cover: 'sage_residences',
		coverAlt: 'Placeholder illustration of low-rise villas with sage-green landscaping',
		gallery: [
			g(
				'sage_villa_dusk',
				'Placeholder illustration of a villa lit at dusk',
				'Villa frontage at dusk'
			),
			g(
				'sage_interior',
				'Placeholder illustration of a double-height villa living room',
				'Double-height living'
			),
			g(
				'landscape_garden',
				'Placeholder illustration of the central landscaped garden',
				'Central green'
			),
			g('amenity_clubhouse', 'Placeholder illustration of the clubhouse', 'Clubhouse')
		],
		overview: body(
			p(
				'Each villa at The Sage Residences is organised around a private internal courtyard — a pocket of sky and planting at the heart of the home that brings daylight into every room.'
			),
			p(
				'The community is ready to move in, with all common amenities operational and a resident association in place.'
			)
		),
		keyFacts: [
			fact('Land area', '5.1 acres'),
			fact('Villas', '42'),
			fact('Plot sizes', '2,400 – 3,600 sq ft'),
			fact('Status', 'Ready to move')
		],
		bedrooms: [3, 4],
		areaRange: { min: 2150, max: 3400 },
		priceDisplay: '₹1.6 Cr – ₹2.4 Cr',
		priceFrom: 16000000,
		priceTo: 24000000,
		highlights: [
			'Private internal courtyard in every villa',
			'Gated community with a single, staffed entry',
			'Clubhouse, pool and landscaped central green',
			'Occupancy certificate received'
		],
		amenities: [
			amenity('waves-ladder', 'Swimming pool'),
			amenity('building', 'Clubhouse'),
			amenity('trees', 'Central green'),
			amenity('bike', 'Cycling loop'),
			amenity('shield-check', 'Gated security'),
			amenity('sun', 'Solar street lighting')
		],
		specifications: residentialSpecs(),
		units: [
			{
				_key: k(),
				name: '3 BHK courtyard villa',
				bedrooms: 3,
				carpetArea: 1780,
				builtUpArea: 2150,
				priceLabel: '₹1.6 Cr onwards',
				availability: 'limited',
				unitsAvailable: 3,
				totalUnits: 26,
				floorPlan: img('plan_villa', 'Placeholder floor plan of a three-bedroom courtyard villa')
			},
			{
				_key: k(),
				name: '4 BHK corner villa',
				bedrooms: 4,
				carpetArea: 2790,
				builtUpArea: 3400,
				priceLabel: '₹2.3 Cr onwards',
				availability: 'available',
				unitsAvailable: 2,
				totalUnits: 16,
				floorPlan: img('plan_villa', 'Placeholder floor plan of a four-bedroom corner villa')
			}
		],
		showInventory: true,
		approvals: [
			{
				_key: k(),
				authority: 'Layout approval',
				reference: '[Replace with approval no.]',
				status: 'approved'
			},
			{
				_key: k(),
				authority: 'Occupancy certificate',
				reference: '[Replace with OC no.]',
				status: 'approved'
			}
		],
		rera: { number: '[Demo] TN/00/Layout/0000/2023', website: 'https://rera.tn.gov.in/' },
		connectivity: [
			near('Maruthamalai Road', '300 m'),
			near('Agricultural University campus', '4 km'),
			near('Town centre', '8 km')
		],
		brochure: file('brochure_sample', 'The Sage Residences — brochure'),
		faqs: refs(['faq.project-1', 'faq.buying-1']),
		relatedProjects: refs(['project.terracotta-house', 'project.ivory-row'])
	}),
	project({
		id: 'meridian-works',
		title: 'Meridian Works',
		status: 'upcoming',
		propertyType: 'commercial',
		featured: true,
		order: 3,
		tagline:
			'A naturally lit workplace building with flexible floor plates and a public ground-floor arcade.',
		locality: 'Avinashi Road',
		city: 'Coimbatore',
		address: '[Demo] Avinashi Road, Peelamedu, Coimbatore 641004',
		lat: 11.0296,
		lng: 77.0266,
		cover: 'meridian_works',
		coverAlt: 'Placeholder illustration of a glass-and-fin office building at dusk',
		gallery: [
			g(
				'meridian_lobby',
				'Placeholder illustration of a double-height office lobby',
				'Arrival lobby'
			),
			g('office', 'Placeholder illustration of the building in daylight', 'Street elevation')
		],
		overview: body(
			p(
				'Meridian Works is planned for teams that have outgrown serviced desks. Terracotta fins shade a fully glazed facade, and column-free floor plates can be split into suites from 2,000 sq ft.'
			),
			p('The ground floor opens to the street as a shaded arcade of cafés and services.')
		),
		keyFacts: [
			fact('Floors', 'B2 + G + 9'),
			fact('Leasable area', '1.4 lakh sq ft'),
			fact('Floor plate', '14,500 sq ft'),
			fact('Launch', 'Q2 2027 (target)')
		],
		bedrooms: [],
		areaRange: { min: 2000, max: 14500 },
		priceDisplay: 'Price on request',
		highlights: [
			'Column-free floor plates, divisible from 2,000 sq ft',
			'Terracotta fins shade the facade and cut solar gain',
			'Two basement levels of parking with EV provision',
			'Public ground-floor arcade'
		],
		amenities: [
			amenity('car', 'Two-level basement parking'),
			amenity('zap', '100% power backup'),
			amenity('store', 'Ground-floor arcade'),
			amenity('wind', 'Fresh-air ventilation')
		],
		specifications: [
			specGroup('Building', [
				['Structure', 'RCC frame with post-tensioned slabs for column-free spans'],
				['Facade', 'Double-glazed units with terracotta fins'],
				['Lifts', 'Four passenger lifts and one service lift']
			])
		],
		units: [],
		showInventory: false,
		approvals: [
			{ _key: k(), authority: 'Planning permit', reference: 'Application filed', status: 'applied' }
		],
		connectivity: [near('Airport', '6 km'), near('Metro corridor (proposed)', '400 m')],
		faqs: refs(['faq.general-1']),
		relatedProjects: refs(['project.tamarind-court'])
	}),
	project({
		id: 'palm-grid-enclave',
		title: 'Palm Grid Enclave',
		status: 'ongoing',
		propertyType: 'plotted',
		featured: true,
		order: 4,
		tagline:
			'Approved residential plots on a shaded grid of avenues, ready for you to build on your own schedule.',
		locality: 'Kovaipudur',
		city: 'Coimbatore',
		address: '[Demo] Kovaipudur Main Road, Coimbatore 641042',
		lat: 10.9459,
		lng: 76.9312,
		cover: 'palm_grid',
		coverAlt: 'Placeholder illustration of a plotted layout with tree-lined roads',
		gallery: [
			g(
				'palm_grid_avenue',
				'Placeholder illustration of a tree-lined avenue at dawn',
				'Avenue at dawn'
			),
			g('plan_plot', 'Placeholder layout plan of the plotted development', 'Layout plan')
		],
		overview: body(
			p(
				'Palm Grid Enclave is laid out on a simple, legible grid of avenues lined with native shade trees. Plots are sized for independent homes, with underground utilities already in place.'
			),
			p(
				'Buyers can build independently, or engage Spacecraft Associates for design and construction under a separate agreement.'
			)
		),
		keyFacts: [
			fact('Layout area', '11 acres'),
			fact('Plots', '164'),
			fact('Plot sizes', '1,200 – 2,400 sq ft'),
			fact('Road widths', '30 ft & 40 ft')
		],
		bedrooms: [],
		areaRange: { min: 1200, max: 2400 },
		priceDisplay: '₹18 L – ₹46 L',
		priceFrom: 1800000,
		priceTo: 4600000,
		highlights: [
			'Clear-title land with layout approval',
			'Underground electrical cabling and water points to each plot',
			'Optional design-and-build package from Spacecraft Associates'
		],
		amenities: [
			amenity('route', 'Blacktop avenues'),
			amenity('trees', 'Avenue planting'),
			amenity('fence', 'Compound wall'),
			amenity('utility-pole', 'Underground utilities')
		],
		specifications: plotSpecs(),
		units: [
			{
				_key: k(),
				name: '1,200 sq ft plots',
				carpetArea: 1200,
				priceLabel: '₹18 L onwards',
				availability: 'available',
				unitsAvailable: 38,
				totalUnits: 64
			},
			{
				_key: k(),
				name: '1,800 sq ft plots',
				carpetArea: 1800,
				priceLabel: '₹30 L onwards',
				availability: 'available',
				unitsAvailable: 22,
				totalUnits: 60
			},
			{
				_key: k(),
				name: '2,400 sq ft corner plots',
				carpetArea: 2400,
				priceLabel: '₹44 L onwards',
				availability: 'limited',
				unitsAvailable: 4,
				totalUnits: 40
			}
		],
		showInventory: true,
		approvals: [
			{
				_key: k(),
				authority: 'DTCP layout approval',
				reference: '[Replace with DTCP no.]',
				status: 'approved'
			}
		],
		rera: { number: '[Demo] TN/00/Layout/0000/2025', website: 'https://rera.tn.gov.in/' },
		dtcpNumber: '[Demo] DTCP No. 000/2025',
		connectivity: [near('Kovaipudur bus terminus', '1.2 km'), near('Engineering college', '3 km')],
		brochure: file('brochure_sample', 'Palm Grid Enclave — layout brochure'),
		faqs: refs(['faq.buying-3', 'faq.project-2']),
		relatedProjects: refs(['project.northfield'])
	}),
	project({
		id: 'terracotta-house',
		title: 'Terracotta House',
		status: 'completed',
		propertyType: 'villa',
		order: 5,
		tagline:
			'A private family residence in exposed brick and lime plaster, designed and built for a client’s own land.',
		locality: 'RS Puram',
		city: 'Coimbatore',
		address: '[Demo] RS Puram, Coimbatore 641002',
		lat: 11.0089,
		lng: 76.9504,
		cover: 'terracotta_house',
		coverAlt: 'Placeholder illustration of a brick house lit at night',
		gallery: [
			g('interior_living', 'Placeholder illustration of a brick-walled living room', 'Living room')
		],
		overview: body(
			p(
				'Built on the client’s own plot, Terracotta House was designed, approved and constructed by Spacecraft Associates in fourteen months. The walls are exposed wire-cut brick with lime plaster inside.'
			)
		),
		keyFacts: [
			fact('Built-up area', '4,200 sq ft'),
			fact('Delivered', '2024'),
			fact('Engagement', 'Design + build')
		],
		bedrooms: [4],
		areaRange: { min: 4200, max: 4200 },
		priceDisplay: 'Private residence',
		highlights: [
			'Exposed wire-cut brick facade',
			'Lime-plaster interiors',
			'Delivered in 14 months'
		],
		amenities: [amenity('sun', 'Rooftop solar'), amenity('droplets', 'Rainwater harvesting')],
		specifications: residentialSpecs(),
		units: [],
		showInventory: false,
		approvals: [
			{ _key: k(), authority: 'Building permit', reference: '[Replace]', status: 'approved' }
		],
		relatedProjects: refs(['project.sage-residences'])
	}),
	project({
		id: 'lakeline',
		title: 'Lakeline Apartments',
		status: 'completed',
		propertyType: 'apartment',
		order: 6,
		tagline: 'Seventy-two lake-facing apartments, delivered and fully occupied.',
		locality: 'Singanallur',
		city: 'Coimbatore',
		address: '[Demo] Trichy Road, Singanallur, Coimbatore 641005',
		lat: 10.9998,
		lng: 77.0325,
		cover: 'lakeline',
		coverAlt: 'Placeholder illustration of an apartment building at dawn beside a lake',
		gallery: [g('lakeline_pool', 'Placeholder illustration of the pool deck', 'Pool deck')],
		overview: body(
			p(
				'Lakeline was planned so that every living room faces the water. The building was handed over in 2022, and the residents’ association has run it since.'
			)
		),
		keyFacts: [fact('Homes', '72'), fact('Handover', '2022'), fact('Floors', 'G + 8')],
		bedrooms: [2, 3],
		areaRange: { min: 1150, max: 1520 },
		priceDisplay: 'Sold out',
		highlights: ['Lake-facing living rooms', 'Delivered ahead of the committed date'],
		amenities: [amenity('waves-ladder', 'Pool'), amenity('dumbbell', 'Gym')],
		specifications: residentialSpecs(),
		units: [],
		showInventory: false,
		approvals: [
			{ _key: k(), authority: 'Occupancy certificate', reference: '[Replace]', status: 'approved' }
		],
		relatedProjects: refs(['project.tamarind-court'])
	}),
	project({
		id: 'ivory-row',
		title: 'Ivory Row Townhomes',
		status: 'upcoming',
		propertyType: 'villa',
		order: 7,
		tagline:
			'Twenty-four three-storey townhomes with rooftop terraces, a short walk from the city.',
		locality: 'Peelamedu',
		city: 'Coimbatore',
		address: '[Demo] Peelamedu, Coimbatore 641004',
		lat: 11.0255,
		lng: 77.0021,
		cover: 'ivory_row',
		coverAlt: 'Placeholder illustration of a row of townhomes at dawn',
		overview: body(
			p(
				'A terrace of limestone-rendered townhomes with private rooftop terraces. Pre-launch enquiries are open.'
			)
		),
		keyFacts: [
			fact('Townhomes', '24'),
			fact('Configuration', '3 & 4 BHK'),
			fact('Launch', 'Early 2027')
		],
		bedrooms: [3, 4],
		areaRange: { min: 2400, max: 2900 },
		priceDisplay: 'From ₹1.9 Cr (indicative)',
		priceFrom: 19000000,
		priceTo: 26000000,
		highlights: ['Private rooftop terraces', 'Walkable to schools and hospitals'],
		amenities: [amenity('sun', 'Rooftop terraces'), amenity('car', 'Two covered parking bays')],
		specifications: residentialSpecs(),
		units: [],
		showInventory: false,
		approvals: [
			{
				_key: k(),
				authority: 'Planning permit',
				reference: 'Application in preparation',
				status: 'pending'
			}
		],
		relatedProjects: refs(['project.sage-residences'])
	}),
	project({
		id: 'northfield',
		title: 'Northfield Plots',
		status: 'ready',
		propertyType: 'plotted',
		order: 8,
		tagline: 'Registration-ready plots with every road, drain and streetlight already complete.',
		locality: 'Thudiyalur',
		city: 'Coimbatore',
		address: '[Demo] Mettupalayam Road, Thudiyalur, Coimbatore 641034',
		lat: 11.0819,
		lng: 76.9395,
		cover: 'northfield',
		coverAlt: 'Placeholder illustration of a completed plotted layout at dusk',
		overview: body(
			p(
				'All infrastructure at Northfield is complete, so plots can be registered and building work can begin immediately.'
			)
		),
		keyFacts: [fact('Plots', '96'), fact('Plot sizes', '1,500 – 2,400 sq ft')],
		bedrooms: [],
		areaRange: { min: 1500, max: 2400 },
		priceDisplay: '₹24 L – ₹41 L',
		priceFrom: 2400000,
		priceTo: 4100000,
		highlights: ['Immediate registration', 'Every road, drain and streetlight complete'],
		amenities: [amenity('route', 'Blacktop roads'), amenity('trees', 'Park')],
		specifications: plotSpecs(),
		units: [],
		showInventory: false,
		approvals: [
			{ _key: k(), authority: 'DTCP layout approval', reference: '[Replace]', status: 'approved' }
		],
		dtcpNumber: '[Demo] DTCP No. 000/2022',
		relatedProjects: refs(['project.palm-grid-enclave'])
	})
];

export const projectUpdates: SeedDoc[] = [
	{
		_id: 'update.tamarind-1',
		_type: 'projectUpdate',
		project: { _type: 'reference', _ref: 'project.tamarind-court' },
		title: 'Tower A structure reaches slab 9',
		date: '2026-08-28',
		progress: 58,
		stage: 'structure',
		summary:
			'Slab 9 of Tower A was cast on schedule. Masonry on floors 1–5 is complete and plumbing sleeves are being fixed ahead of the slab 10 pour.',
		images: [g('tamarind_site', 'Placeholder illustration of Tower A under construction')]
	},
	{
		_id: 'update.tamarind-2',
		_type: 'projectUpdate',
		project: { _type: 'reference', _ref: 'project.tamarind-court' },
		title: 'Tower B foundation complete',
		date: '2026-05-14',
		progress: 34,
		stage: 'structure',
		summary:
			'Raft foundation of Tower B was completed after pile integrity testing. Cube test reports for all pours are in the project quality file.',
		images: [g('site_foundation', 'Placeholder illustration of foundation works')]
	},
	{
		_id: 'update.tamarind-3',
		_type: 'projectUpdate',
		project: { _type: 'reference', _ref: 'project.tamarind-court' },
		title: 'Ground-breaking and soil investigation',
		date: '2025-11-03',
		progress: 8,
		stage: 'foundation',
		summary:
			'Site clearing was completed without removing any of the heritage tamarind trees. Soil investigation confirmed the foundation design.'
	},
	{
		_id: 'update.palm-1',
		_type: 'projectUpdate',
		project: { _type: 'reference', _ref: 'project.palm-grid-enclave' },
		title: 'Phase 1 roads and drains complete',
		date: '2026-07-19',
		progress: 64,
		stage: 'envelope',
		summary:
			'Blacktop roads and covered storm-water drains in Phase 1 are complete. Underground cabling is under way in Phase 2.',
		images: [g('palm_grid_avenue', 'Placeholder illustration of a finished avenue')]
	}
];
