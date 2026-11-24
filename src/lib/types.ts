/* View-model types — the shapes returned by the GROQ projections in $lib/server/queries.ts */

export type PortableTextBlock = {
	_type: string;
	_key: string;
	style?: string;
	listItem?: 'bullet' | 'number';
	level?: number;
	children?: { _type: 'span'; _key: string; text: string; marks?: string[] }[];
	markDefs?: { _key: string; _type: string; href?: string; blank?: boolean }[];
	[key: string]: unknown;
};

export type SanityImage = {
	_type?: string;
	asset?: { _ref: string; _type?: string };
	alt?: string;
	caption?: string;
	credit?: string;
	hotspot?: { x: number; y: number; width: number; height: number };
	crop?: { top: number; bottom: number; left: number; right: number };
	lqip?: string | null;
	_key?: string;
};

export type CtaAction = 'link' | 'consultation' | 'whatsapp';
export type Cta = {
	label: string;
	href?: string;
	variant?: 'primary' | 'secondary' | 'ghost';
	action?: CtaAction;
};

export type Seo = {
	title?: string;
	description?: string;
	image?: SanityImage;
	noIndex?: boolean;
	canonical?: string;
};

export type Stat = {
	_key: string;
	value: number;
	label: string;
	prefix?: string;
	suffix?: string;
	decimals?: number;
};
export type Feature = { _key: string; icon?: string; title: string; description?: string };
export type ProcessStep = {
	_key: string;
	title: string;
	description?: string;
	duration?: string;
	stage?: string;
};

export type NavItem = {
	_key: string;
	label: string;
	href: string;
	description?: string;
	children?: { _key: string; label: string; href: string }[];
};

export type SiteSettings = {
	siteName: string;
	tagline?: string;
	demoNotice?: string;
	logo?: SanityImage;
	logoText?: string;
	contact?: {
		phone?: string;
		phoneDisplay?: string;
		email?: string;
		whatsapp?: string;
		whatsappMessage?: string;
	};
	address?: {
		line1?: string;
		line2?: string;
		city?: string;
		state?: string;
		postalCode?: string;
		country?: string;
		lat?: number;
		lng?: number;
	};
	businessHours?: { _key: string; days: string; hours: string }[];
	serviceAreas?: string[];
	social?: { _key: string; platform: string; url: string }[];
	organization?: { legalName?: string; foundingYear?: number; priceRange?: string };
	features?: {
		enablePlotSales?: boolean;
		enableUnitInventory?: boolean;
		showContactDock?: boolean;
	};
	leadForms?: {
		consentText?: string;
		successTitle?: string;
		successMessage?: string;
		interestOptions?: string[];
		budgetOptions?: string[];
	};
	seo?: Seo;
};

export type Navigation = { main?: NavItem[]; headerCta?: Cta };
export type Footer = {
	statement?: string;
	columns?: {
		_key: string;
		title: string;
		links: { _key: string; label: string; href: string }[];
	}[];
	legalLinks?: { _key: string; label: string; href: string }[];
	disclaimer?: string;
	instagram?: { show?: boolean; heading?: string; intro?: string };
};

/** One post in the footer Instagram "site journal" (see $lib/server/instagram). */
export type InstagramPost = {
	id: string;
	kind: 'image' | 'video' | 'album';
	/** Photo, first album image, or the video's cover frame. */
	image: string;
	/** Video file, for the hover preview of reels. */
	video?: string;
	caption: string;
	permalink: string;
	timestamp: string;
};
export type InstagramProfile = {
	username: string;
	name?: string;
	avatar?: string;
	followers?: number;
	posts?: number;
};
export type InstagramFeed = {
	/** demo = sample posts in demo mode; unconfigured = no token; error = Instagram unreachable. */
	status: 'ok' | 'demo' | 'unconfigured' | 'error';
	profile: InstagramProfile | null;
	posts: InstagramPost[];
	/** Cursor for the next page, or null at the end. */
	next: string | null;
};

export type ProjectStatus = 'upcoming' | 'ongoing' | 'completed' | 'ready';
export type PropertyType = 'apartment' | 'villa' | 'gatedCommunity' | 'commercial' | 'plotted';

export type ProjectCard = {
	_id: string;
	title: string;
	slug: string;
	status: ProjectStatus;
	propertyType: PropertyType;
	tagline?: string;
	location?: { locality?: string; city?: string };
	coverImage?: SanityImage;
	bedrooms?: number[];
	areaRange?: { min?: number; max?: number };
	priceDisplay?: string;
	priceFrom?: number;
	priceTo?: number;
	keyFacts?: { _key: string; label: string; value: string }[];
	featured?: boolean;
};

export type Unit = {
	_key: string;
	name: string;
	bedrooms?: number;
	carpetArea?: number;
	builtUpArea?: number;
	priceLabel?: string;
	availability?: 'available' | 'limited' | 'soldOut' | 'onHold';
	unitsAvailable?: number;
	totalUnits?: number;
	floorPlan?: SanityImage;
};

export type Faq = { _id: string; question: string; answer?: PortableTextBlock[] };

export type ProjectUpdate = {
	_id: string;
	title: string;
	date: string;
	progress?: number;
	stage?: string;
	summary?: string;
	images?: SanityImage[];
};

export type ProjectDetail = ProjectCard & {
	location?: ProjectCard['location'] & { address?: string; lat?: number; lng?: number };
	gallery?: SanityImage[];
	videoUrl?: string;
	virtualTourUrl?: string;
	overview?: PortableTextBlock[];
	highlights?: string[];
	amenities?: { _key: string; icon?: string; label: string }[];
	specifications?: {
		_key: string;
		category: string;
		items: { _key: string; label: string; detail: string; brand?: string }[];
	}[];
	floorPlans?: { _key: string; title: string; image?: SanityImage }[];
	units?: Unit[];
	showInventory?: boolean;
	approvals?: {
		_key: string;
		authority: string;
		reference?: string;
		status?: 'approved' | 'applied' | 'pending';
		date?: string;
	}[];
	rera?: { number?: string; website?: string };
	dtcpNumber?: string;
	connectivity?: { _key: string; place: string; distance: string }[];
	hasBrochure?: boolean;
	faqs?: Faq[];
	relatedProjects?: ProjectCard[];
	updates?: ProjectUpdate[];
	seo?: Seo;
};

export type ServiceCard = {
	_id: string;
	title: string;
	slug: string;
	icon?: string;
	summary?: string;
	heroImage?: SanityImage;
};

export type ServiceDetail = ServiceCard & {
	body?: PortableTextBlock[];
	process?: ProcessStep[];
	deliverables?: string[];
	relatedProjects?: ProjectCard[];
	faqs?: Faq[];
	enquiryInterest?: string;
	seo?: Seo;
};

export type Testimonial = {
	_id: string;
	quote: string;
	name: string;
	context?: string;
	photo?: SanityImage;
	project?: { title: string; slug: string } | null;
};

export type TeamMember = {
	_id: string;
	name: string;
	role?: string;
	bio?: string;
	photo?: SanityImage;
	linkedin?: string;
};

export type Author = { name: string; role?: string; photo?: SanityImage };
export type Category = { _id: string; title: string; slug: string; description?: string };

export type PostCard = {
	_id: string;
	title: string;
	slug: string;
	excerpt?: string;
	coverImage?: SanityImage;
	publishedAt: string;
	categories?: Category[];
	author?: Author | null;
	readMinutes?: number;
	featured?: boolean;
};

export type PostDetail = PostCard & {
	body?: PortableTextBlock[];
	related?: PostCard[];
	seo?: Seo;
	_updatedAt?: string;
};

export type Guide = {
	_id: string;
	title: string;
	slug: string;
	topic?: string;
	icon?: string;
	excerpt?: string;
	checklist?: string[];
	body?: PortableTextBlock[];
	seo?: Seo;
	_updatedAt?: string;
};

export type GalleryItem = {
	_id: string;
	title: string;
	category: string;
	image: SanityImage;
	project?: { title: string; slug: string } | null;
};

export type PageSection = { _key: string; _type: string; [key: string]: unknown };

export type Page = {
	_id: string;
	title: string;
	slug: string;
	hero?: { eyebrow?: string; heading?: string; intro?: string; image?: SanityImage };
	sections?: PageSection[];
	guides?: Guide[] | null;
	seo?: Seo;
	_updatedAt?: string;
};

export type HomePage = {
	hero?: {
		eyebrow?: string;
		headline?: string;
		intro?: string;
		primaryCta?: Cta;
		secondaryCta?: Cta;
		mediaMode?: 'scene' | 'image' | 'video';
		image?: SanityImage;
		videoUrl?: string;
		coordinatesLabel?: string;
	};
	statsHeading?: string;
	stats?: Stat[];
	projectsHeading?: string;
	projectsIntro?: string;
	featuredProjects?: ProjectCard[];
	servicesHeading?: string;
	servicesIntro?: string;
	services?: ServiceCard[];
	pillarsHeading?: string;
	pillarsIntro?: string;
	pillars?: Feature[];
	process?: { heading?: string; intro?: string; steps?: ProcessStep[] };
	testimonialsHeading?: string;
	testimonials?: Testimonial[];
	insightsHeading?: string;
	insightsIntro?: string;
	posts?: PostCard[];
	faqHeading?: string;
	faqs?: Faq[];
	cta?: { eyebrow?: string; heading?: string; text?: string; primaryCta?: Cta; secondaryCta?: Cta };
	seo?: Seo;
};

export type ProjectOption = { title: string; slug: string; status: ProjectStatus };
export type ServiceOption = { title: string; slug: string };

export type LayoutData = {
	settings: SiteSettings;
	navigation: Navigation | null;
	footer: Footer | null;
	projectOptions: ProjectOption[];
	serviceOptions: ServiceOption[];
};
