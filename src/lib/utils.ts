import type { ProjectStatus, PropertyType, SiteSettings } from '$lib/types';

export const STATUS_LABELS: Record<ProjectStatus, string> = {
	upcoming: 'Upcoming',
	ongoing: 'Ongoing',
	completed: 'Completed',
	ready: 'Ready to move'
};

export const TYPE_LABELS: Record<PropertyType, string> = {
	apartment: 'Apartments',
	villa: 'Villas',
	gatedCommunity: 'Gated community',
	commercial: 'Commercial',
	plotted: 'Plotted development'
};

export const GALLERY_CATEGORIES: Record<string, string> = {
	exteriors: 'Exteriors',
	interiors: 'Interiors',
	construction: 'Construction',
	amenities: 'Amenities',
	plots: 'Plots & layouts',
	events: 'Events'
};

export const BUDGET_RANGES = [
	{ value: 'under-50l', label: 'Under ₹50 L', min: 0, max: 5_000_000 },
	{ value: '50l-1cr', label: '₹50 L – ₹1 Cr', min: 5_000_000, max: 10_000_000 },
	{ value: '1cr-2cr', label: '₹1 – 2 Cr', min: 10_000_000, max: 20_000_000 },
	{ value: 'above-2cr', label: 'Above ₹2 Cr', min: 20_000_000, max: Number.POSITIVE_INFINITY }
] as const;

export function cx(...classes: (string | false | null | undefined)[]) {
	return classes.filter(Boolean).join(' ');
}

export function formatNumber(n: number, decimals = 0) {
	return new Intl.NumberFormat('en-IN', {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals
	}).format(n);
}

export function formatArea(range?: { min?: number; max?: number }) {
	if (!range?.min) return undefined;
	if (!range.max || range.max === range.min) return `${formatNumber(range.min)} sq ft`;
	return `${formatNumber(range.min)} – ${formatNumber(range.max)} sq ft`;
}

export function formatBedrooms(bedrooms?: number[]) {
	if (!bedrooms?.length) return undefined;
	const sorted = [...bedrooms].sort((a, b) => a - b);
	return `${sorted.join(', ').replace(/, (\d+)$/, ' & $1')} BHK`;
}

export function formatDate(iso: string | undefined, style: 'long' | 'short' = 'long') {
	if (!iso) return '';
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return iso;
	return new Intl.DateTimeFormat('en-IN', {
		day: 'numeric',
		month: style === 'long' ? 'long' : 'short',
		year: 'numeric',
		timeZone: 'Asia/Kolkata'
	}).format(d);
}

/** Build a wa.me link with a contextual, pre-filled message. */
export function whatsappLink(settings: SiteSettings | undefined, context?: string) {
	const number = settings?.contact?.whatsapp?.replace(/\D/g, '');
	if (!number) return undefined;
	const template =
		settings?.contact?.whatsappMessage ?? 'Hello, I would like to know more{context}.';
	const text = template.replace('{context}', context ? ` about ${context}` : '');
	return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function telLink(settings: SiteSettings | undefined) {
	const phone = settings?.contact?.phone?.replace(/[^\d+]/g, '');
	return phone ? `tel:${phone}` : undefined;
}

export function isExternal(href: string | undefined) {
	return !!href && /^(https?:)?\/\//.test(href);
}

/** Convert a YouTube / Vimeo / generic URL into an embeddable URL. */
export function toEmbedUrl(url: string | undefined) {
	if (!url) return null;
	try {
		const u = new URL(url);
		if (u.hostname.includes('youtube.com')) {
			const id = u.searchParams.get('v') ?? u.pathname.split('/').pop();
			return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0` : null;
		}
		if (u.hostname === 'youtu.be')
			return `https://www.youtube-nocookie.com/embed${u.pathname}?rel=0`;
		if (u.hostname.includes('vimeo.com')) {
			const id = u.pathname.split('/').filter(Boolean).pop();
			return id ? `https://player.vimeo.com/video/${id}?dnt=1` : null;
		}
		return u.protocol === 'https:' ? url : null;
	} catch {
		return null;
	}
}

export function slugify(s: string) {
	return s
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[^\w\s-]/g, '')
		.trim()
		.replace(/[\s_]+/g, '-')
		.replace(/-+/g, '-');
}

export function sheetNumber(n: number) {
	return `SA—${String(n).padStart(2, '0')}`;
}
