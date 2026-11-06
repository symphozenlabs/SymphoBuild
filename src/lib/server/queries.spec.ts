/**
 * Runs every production GROQ query against the demo dataset (groq-js). This guards
 * both the queries and the seed content that is imported into Sanity.
 */
import { describe, expect, it } from 'vitest';
import { demoFetch } from './demo/store';
import { seedDocuments } from './demo/seed/index';
import * as Q from './queries';

describe('seed dataset', () => {
	it('has unique ids and resolvable references', () => {
		const ids = new Set(seedDocuments.map((d) => d._id));
		expect(ids.size).toBe(seedDocuments.length);
		const missing: string[] = [];
		const walk = (v: unknown) => {
			if (Array.isArray(v)) v.forEach(walk);
			else if (v && typeof v === 'object') {
				const o = v as Record<string, unknown>;
				if (
					o._type === 'reference' &&
					typeof o._ref === 'string' &&
					!/^(image|file)-/.test(o._ref) &&
					!ids.has(o._ref)
				)
					missing.push(o._ref);
				Object.values(o).forEach(walk);
			}
		};
		seedDocuments.forEach(walk);
		expect(missing).toEqual([]);
	});

	it('gives every image meaningful alt text', () => {
		const bad: string[] = [];
		const walk = (v: unknown, path: string) => {
			if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`));
			else if (v && typeof v === 'object') {
				const o = v as Record<string, unknown>;
				if (o._type === 'imageWithAlt' && (typeof o.alt !== 'string' || o.alt.length < 8))
					bad.push(path);
				Object.entries(o).forEach(([k, x]) => walk(x, `${path}.${k}`));
			}
		};
		seedDocuments.forEach((d) => walk(d, d._id));
		expect(bad).toEqual([]);
	});
});

describe('GROQ queries (demo mode)', () => {
	it('loads the layout', async () => {
		const r = await demoFetch<{ settings: { siteName: string }; projectOptions: unknown[] }>(
			Q.LAYOUT_QUERY
		);
		expect(r.settings.siteName).toBe('Spacecraft Associates');
		expect(r.projectOptions.length).toBeGreaterThan(0);
	});

	it('loads the home page with dereferenced content', async () => {
		const r = await demoFetch<Record<string, { length: number } & unknown[]>>(Q.HOME_QUERY);
		expect(r.featuredProjects.length).toBe(4);
		expect(r.services.length).toBe(7);
		expect(r.posts.length).toBe(3);
	});

	it('loads a project with its construction updates but without the raw brochure asset', async () => {
		const r = await demoFetch<Record<string, unknown>>(Q.PROJECT_QUERY, { slug: 'tamarind-court' });
		expect(r.title).toBe('Tamarind Court');
		expect((r.updates as unknown[]).length).toBe(3);
		expect(r.hasBrochure).toBe(true);
		expect(r).not.toHaveProperty('brochure');
	});

	it('paginates and filters insights by category', async () => {
		const all = await demoFetch<{ total: number }>(Q.POSTS_QUERY, {
			category: '',
			start: 0,
			end: 9
		});
		const one = await demoFetch<{ total: number }>(Q.POSTS_QUERY, {
			category: 'homebuying',
			start: 0,
			end: 9
		});
		expect(one.total).toBeLessThan(all.total);
	});

	it('expands page-builder references', async () => {
		const r = await demoFetch<{ sections: { _type: string; members?: unknown[] }[] }>(
			Q.PAGE_QUERY,
			{ slug: 'about' }
		);
		expect(r.sections.find((s) => s._type === 'teamSection')?.members?.length).toBe(5);
	});

	it('returns null for unknown slugs', async () => {
		expect(await demoFetch(Q.PROJECT_QUERY, { slug: 'nope' })).toBeNull();
	});
});
