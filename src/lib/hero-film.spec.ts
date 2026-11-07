import { describe, expect, it } from 'vitest';
import { FILM, HERO_SPAN, STAGE_WINDOWS, filmTime, stageWindow, stillAt } from './hero-film';

describe('hero film timeline', () => {
	it('plays the opening seconds while the hero scrolls away', () => {
		expect(filmTime({ heroProgress: 0, index: -1, frac: 0, count: 6 })).toBe(0);
		expect(filmTime({ heroProgress: 1, index: -1, frac: 0, count: 6 })).toBe(HERO_SPAN);
		expect(filmTime({ heroProgress: 4, index: -1, frac: 0, count: 6 })).toBe(HERO_SPAN);
	});

	it('maps each stage to its window and interpolates within it', () => {
		const [a, b] = STAGE_WINDOWS.envelope;
		expect(filmTime({ heroProgress: 1, index: 3, frac: 0, stage: 'envelope', count: 6 })).toBe(a);
		expect(filmTime({ heroProgress: 1, index: 3, frac: 1, stage: 'envelope', count: 6 })).toBe(b);
		expect(
			filmTime({ heroProgress: 1, index: 3, frac: 0.5, stage: 'envelope', count: 6 })
		).toBeCloseTo((a + b) / 2);
	});

	it('the seeded seven-step sequence only ever moves the film forward', () => {
		const stages = [
			'design',
			'approvals',
			'structure',
			'envelope',
			'finishes',
			'aftercare',
			'handover'
		];
		let last = -1;
		stages.forEach((stage, i) => {
			for (const frac of [0, 0.5, 1]) {
				const t = filmTime({ heroProgress: 1, index: i, frac, stage, count: 7 });
				expect(t).toBeGreaterThanOrEqual(last);
				last = t;
			}
		});
		expect(last).toBe(FILM.duration);
	});

	it('starts structure after foundation when both steps exist', () => {
		expect(stageWindow('structure', 3, 7, true)[0]).toBe(STAGE_WINDOWS.foundation[1]);
		expect(stageWindow('structure', 2, 6, false)).toEqual(STAGE_WINDOWS.structure);
	});

	it('shares the film evenly between steps without a stage', () => {
		const [a, b] = stageWindow(undefined, 0, 2);
		expect(a).toBe(HERO_SPAN);
		expect(b).toBeCloseTo((HERO_SPAN + FILM.duration) / 2);
		expect(stageWindow('unknown', 1, 2)[1]).toBeCloseTo(FILM.duration);
	});

	it('picks the nearest still for reduced motion', () => {
		expect(stillAt(0)).toBe('/hero/stage-0.jpg');
		expect(stillAt(15)).toBe('/hero/stage-3.jpg');
		expect(stillAt(STAGE_WINDOWS.aftercare[1])).toBe('/hero/stage-6.jpg');
		expect(stillAt(FILM.duration)).toBe('/hero/stage-7.jpg');
	});

	it('ends aftercare where the handover scene begins', () => {
		expect(STAGE_WINDOWS.aftercare[1]).toBe(STAGE_WINDOWS.handover[0]);
		expect(STAGE_WINDOWS.handover[1]).toBe(FILM.duration);
	});
});
