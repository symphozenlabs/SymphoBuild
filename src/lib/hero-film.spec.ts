import { describe, expect, it } from 'vitest';
import {
	FILM,
	HERO_SPAN,
	SEGMENTS,
	STAGE_WINDOWS,
	filmTime,
	loadOrder,
	segmentAt,
	segmentTime,
	stepWindows,
	stillAt
} from './hero-film';

describe('hero film timeline', () => {
	const SEEDED = [
		'design',
		'approvals',
		'structure',
		'envelope',
		'finishes',
		'aftercare',
		'handover'
	];
	// The live Sanity content before the Aftercare step was added: six steps, no aftercare.
	const SIX = ['design', 'approvals', 'structure', 'envelope', 'finishes', 'handover'];

	it('plays the opening seconds while the hero scrolls away', () => {
		const windows = stepWindows(SEEDED);
		expect(filmTime({ heroProgress: 0, index: -1, frac: 0, windows })).toBe(0);
		expect(filmTime({ heroProgress: 1, index: -1, frac: 0, windows })).toBe(HERO_SPAN);
		expect(filmTime({ heroProgress: 4, index: -1, frac: 0, windows })).toBe(HERO_SPAN);
	});

	it('maps each stage to its window and interpolates within it', () => {
		const windows = stepWindows(SEEDED);
		const [a, b] = STAGE_WINDOWS.envelope;
		expect(windows[3]).toEqual([a, b]);
		expect(filmTime({ heroProgress: 1, index: 3, frac: 0.5, windows })).toBeCloseTo((a + b) / 2);
	});

	it('plays the film continuously from the hero to the last frame', () => {
		for (const stages of [SEEDED, SIX]) {
			const windows = stepWindows(stages);
			expect(windows[0][0]).toBe(HERO_SPAN);
			windows.slice(1).forEach(([a], i) => expect(a).toBe(windows[i][1]));
			expect(windows.at(-1)![1]).toBe(FILM.duration);
		}
	});

	it('plays through a stage Sanity leaves out instead of jumping over it', () => {
		const finishes = stepWindows(SIX)[4];
		expect(finishes).toEqual([STAGE_WINDOWS.finishes[0], STAGE_WINDOWS.handover[0]]);
	});

	it('starts structure after foundation when both steps exist', () => {
		const windows = stepWindows(['design', 'approvals', 'foundation', 'structure', 'envelope']);
		expect(windows[2]).toEqual([STAGE_WINDOWS.foundation[0], STAGE_WINDOWS.foundation[1]]);
		expect(windows[3][0]).toBe(STAGE_WINDOWS.foundation[1]);
		expect(stepWindows(SEEDED)[2]).toEqual(STAGE_WINDOWS.structure);
	});

	it('shares the film evenly between steps without a stage or out of order', () => {
		const [a, b] = stepWindows([undefined, 'unknown'])[0];
		expect(a).toBe(HERO_SPAN);
		expect(b).toBeCloseTo((HERO_SPAN + FILM.duration) / 2);
		expect(stepWindows([undefined, 'unknown'])[1][1]).toBe(FILM.duration);
		const backwards = stepWindows(['handover', 'design']);
		expect(backwards[0][1]).toBeLessThan(backwards[1][1]);
	});

	it('picks the nearest still for reduced motion', () => {
		expect(stillAt(0)).toBe('/hero/stage-0.jpg');
		expect(stillAt(15)).toBe('/hero/stage-3.jpg');
		expect(stillAt(STAGE_WINDOWS.aftercare[1])).toBe('/hero/stage-6.jpg');
		expect(stillAt(FILM.duration)).toBe('/hero/stage-7.jpg');
	});

	it('splits the film into contiguous segments that cover all of it', () => {
		expect(SEGMENTS[0].start).toBe(0);
		expect(SEGMENTS.at(-1)!.end).toBeCloseTo(FILM.duration, 2);
		SEGMENTS.slice(1).forEach((s, i) => expect(s.start).toBe(SEGMENTS[i].end));
	});

	it('finds the segment and local time for a film time', () => {
		expect(segmentAt(0)).toBe(0);
		expect(segmentAt(SEGMENTS[3].start)).toBe(3);
		expect(segmentAt(SEGMENTS[3].start - 0.01)).toBe(2);
		expect(segmentAt(FILM.duration)).toBe(SEGMENTS.length - 1);
		expect(segmentTime(SEGMENTS[2].start + 1, 2)).toBeCloseTo(1);
		// Clamped to the segment's last frame, and to its start for earlier times.
		const last = SEGMENTS.at(-1)!;
		expect(segmentTime(FILM.duration, SEGMENTS.length - 1)).toBeLessThan(last.end - last.start);
		expect(segmentTime(0, 4)).toBe(0);
	});

	it('downloads the segment in view first, then onwards, then earlier ones', () => {
		expect(loadOrder(0)).toEqual([0, 1, 2, 3, 4, 5, 6]);
		expect(loadOrder(SEGMENTS[4].start + 0.5)).toEqual([4, 5, 6, 3, 2, 1, 0]);
	});

	it('ends aftercare where the handover scene begins', () => {
		expect(STAGE_WINDOWS.aftercare[1]).toBe(STAGE_WINDOWS.handover[0]);
		expect(STAGE_WINDOWS.handover[1]).toBe(FILM.duration);
	});
});
