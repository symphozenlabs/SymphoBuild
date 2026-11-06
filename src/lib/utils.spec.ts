import { describe, expect, it } from 'vitest';
import { fileUrl, imageProps, parseAssetRef } from '$lib/sanity/image';
import { formatArea, formatBedrooms, slugify, toEmbedUrl, whatsappLink } from './utils';

describe('whatsappLink', () => {
	const settings = {
		siteName: 'Spacecraft Associates',
		contact: {
			whatsapp: '+91 90000-00000',
			whatsappMessage: 'Hello, I would like to know more{context}.'
		}
	};
	it('builds a wa.me link with a contextual message', () => {
		const url = whatsappLink(settings, 'Tamarind Court');
		expect(url).toBe(
			`https://wa.me/919000000000?text=${encodeURIComponent('Hello, I would like to know more about Tamarind Court.')}`
		);
	});
	it('omits context cleanly and returns undefined without a number', () => {
		expect(decodeURIComponent(whatsappLink(settings)!.split('text=')[1])).toBe(
			'Hello, I would like to know more.'
		);
		expect(whatsappLink({ siteName: 'x' })).toBeUndefined();
	});
});

describe('formatting', () => {
	it('formats bedrooms and areas', () => {
		expect(formatBedrooms([3, 2])).toBe('2 & 3 BHK');
		expect(formatBedrooms([2, 3, 4])).toBe('2, 3 & 4 BHK');
		expect(formatArea({ min: 1085, max: 1640 })).toBe('1,085 – 1,640 sq ft');
		expect(formatArea({ min: 1200, max: 1200 })).toBe('1,200 sq ft');
	});
	it('slugifies headings for anchors', () => {
		expect(slugify('Why cubes are tested at 7 and 28 days')).toBe(
			'why-cubes-are-tested-at-7-and-28-days'
		);
	});
});

describe('toEmbedUrl', () => {
	it('converts YouTube and Vimeo links to privacy-friendly embeds', () => {
		expect(toEmbedUrl('https://www.youtube.com/watch?v=abc123')).toBe(
			'https://www.youtube-nocookie.com/embed/abc123?rel=0'
		);
		expect(toEmbedUrl('https://youtu.be/abc123')).toBe(
			'https://www.youtube-nocookie.com/embed/abc123?rel=0'
		);
		expect(toEmbedUrl('https://vimeo.com/76979871')).toBe(
			'https://player.vimeo.com/video/76979871?dnt=1'
		);
	});
	it('rejects non-https and invalid URLs', () => {
		expect(toEmbedUrl('javascript:alert(1)')).toBeNull();
		expect(toEmbedUrl('not a url')).toBeNull();
	});
});

describe('image pipeline', () => {
	it('parses Sanity asset refs', () => {
		expect(parseAssetRef('image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg')).toEqual({
			id: 'Tb9Ew8CXIwaY6R1kjMvI0uRR',
			width: 2000,
			height: 3000,
			format: 'jpg'
		});
		expect(parseAssetRef('nonsense')).toBeNull();
	});
	it('serves demo assets locally with intrinsic dimensions', () => {
		const props = imageProps(
			{ alt: 'A tower', asset: { _ref: 'image-demohero_tower-2400x1500-jpg' } },
			{ aspect: 16 / 9 }
		);
		expect(props).toMatchObject({
			src: '/demo/hero_tower.jpg',
			width: 2400,
			height: 1350,
			alt: 'A tower'
		});
		expect(props?.srcset).toContain('/demo/hero_tower-800.jpg 800w');
	});
	it('resolves demo files', () => {
		expect(fileUrl('file-demobrochure_sample-pdf')).toBe('/demo/brochure_sample.pdf');
		expect(fileUrl(null, 'https://cdn.sanity.io/files/x/y/z.pdf')).toBe(
			'https://cdn.sanity.io/files/x/y/z.pdf'
		);
	});
});
