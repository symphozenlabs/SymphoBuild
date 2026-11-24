import { beforeAll, describe, expect, it } from 'vitest';
import type { Cookies } from '@sveltejs/kit';
import { isDemoMode } from './env';
import { LeadSchemas, processLead, rateLimited } from './leads';

const cookies = { get: () => undefined, set: () => {} } as unknown as Cookies;
const form = (data: Record<string, string>) => {
	const fd = new FormData();
	for (const [k, v] of Object.entries(data)) fd.set(k, v);
	return fd;
};
const valid = { name: 'Asha Kumar', phone: '+91 98765 43210', consent: 'on', _ts: '1' };

describe('lead schemas', () => {
	it('accepts a complete consultation and normalises the phone number', () => {
		const r = LeadSchemas.consultation.safeParse({
			...valid,
			interest: 'Villa',
			preferredContact: 'whatsapp'
		});
		expect(r.success).toBe(true);
		expect(r.success && r.data.phone).toBe('+919876543210');
	});

	it('gives human messages for missing required fields', () => {
		const r = LeadSchemas.landowner.safeParse({});
		expect(r.success).toBe(false);
		const messages = r.success ? [] : r.error.issues.map((i) => i.message);
		expect(messages).toContain('Please enter your phone number');
		expect(messages).toContain('Please describe where the land is');
		expect(messages.some((m) => m.includes('expected string'))).toBe(false);
	});

	it('requires consent', () => {
		const r = LeadSchemas.brochure.safeParse({
			...valid,
			consent: undefined,
			project: 'tamarind-court'
		});
		expect(r.success).toBe(false);
	});

	it('rejects invalid phone numbers and past dates', () => {
		expect(
			LeadSchemas.consultation.safeParse({ ...valid, phone: '12345', interest: 'Plot' }).success
		).toBe(false);
		expect(
			LeadSchemas.project.safeParse({
				...valid,
				project: 'tamarind-court',
				preferredDate: '2001-01-01'
			}).success
		).toBe(false);
	});

	it('rejects malformed project slugs', () => {
		expect(LeadSchemas.project.safeParse({ ...valid, project: '../etc/passwd' }).success).toBe(
			false
		);
	});
});

describe('processLead (demo mode)', () => {
	// processLead stores real leads outside demo mode: refuse to run against a live project.
	beforeAll(() => {
		if (!isDemoMode())
			throw new Error('Lead tests must run in demo mode (see vite.config.ts test.env)');
	});

	it('silently accepts honeypot submissions without validating or storing', async () => {
		const r = await processLead('consultation', form({ website: 'http://spam.example' }), {
			cookies,
			ip: '1.1.1.1'
		});
		expect(r).toMatchObject({ ok: true, stored: false });
	});

	it('treats instant submissions as bots', async () => {
		const r = await processLead(
			'consultation',
			form({ ...valid, interest: 'Villa', _ts: String(Date.now()) }),
			{ cookies, ip: '1.1.1.2' }
		);
		expect(r).toMatchObject({ ok: true, stored: false });
	});

	it('returns field errors and echoes values for invalid input', async () => {
		const r = await processLead('consultation', form({ name: 'A', phone: '1', _ts: '1' }), {
			cookies,
			ip: '1.1.1.3'
		});
		expect(r.ok).toBe(false);
		if (!r.ok) {
			expect(r.code).toBe('invalid');
			expect(r.errors.name).toBeDefined();
			expect(r.values.name).toBe('A');
		}
	});

	it('reveals the brochure link only after a valid brochure request', async () => {
		const r = await processLead('brochure', form({ ...valid, project: 'tamarind-court' }), {
			cookies,
			ip: '1.1.1.4'
		});
		expect(r).toMatchObject({
			ok: true,
			brochureUrl: '/demo/brochure_sample.pdf',
			projectTitle: 'Tamarind Court'
		});
	});
});

describe('rate limiting', () => {
	it('blocks after repeated submissions from one address', () => {
		const ip = `test-${Math.random()}`;
		const results = Array.from({ length: 8 }, () => rateLimited(ip));
		expect(results.slice(0, 6).every((r) => r === false)).toBe(true);
		expect(results.at(-1)).toBe(true);
	});
});
