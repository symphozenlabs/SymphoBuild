/**
 * Generates the procedural placeholder imagery used by the demo dataset.
 *
 *   node scripts/generate-demo-images.ts
 *
 * Output: static/demo/<name>.jpg (full size) and <name>-800.jpg (small), plus a
 * sample brochure PDF. Every image carries a visible "DEMO IMAGE" stamp so it is
 * obvious what must be replaced with real photography in Sanity Studio.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { DEMO_IMAGES } from '../src/lib/server/demo/seed/helpers.ts';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = resolve(root, 'static/demo');
mkdirSync(outDir, { recursive: true });

type Tone = 'dawn' | 'day' | 'dusk' | 'night';

const TONES: Record<
	Tone,
	{
		sky: [string, string];
		ground: string;
		mass: string;
		mass2: string;
		glass: string;
		light: string;
		ink: string;
		haze: string;
	}
> = {
	dawn: {
		sky: ['#e9cdb8', '#d7ddd6'],
		ground: '#b9ad97',
		mass: '#e8e0d2',
		mass2: '#cfc4b1',
		glass: '#8e9aa0',
		light: '#f4d7a8',
		ink: '#2c3034',
		haze: '#f4e3d3'
	},
	day: {
		sky: ['#cbd8d6', '#f1ece2'],
		ground: '#b7b09d',
		mass: '#f2ede3',
		mass2: '#d9cfbd',
		glass: '#7f9097',
		light: '#f7e7c4',
		ink: '#2c3034',
		haze: '#eef0ea'
	},
	dusk: {
		sky: ['#232833', '#c7785a'],
		ground: '#3a3530',
		mass: '#b9ab98',
		mass2: '#8c8070',
		glass: '#39424c',
		light: '#f3b875',
		ink: '#16181a',
		haze: '#d78e6a'
	},
	night: {
		sky: ['#0e1114', '#2a3038'],
		ground: '#1c1f22',
		mass: '#5c5a55',
		mass2: '#43423f',
		glass: '#1e252c',
		light: '#f0b26a',
		ink: '#0e1011',
		haze: '#39404a'
	}
};

const COPPER = '#bd6a45';
const SAGE = '#7b8766';
const SAGE_DARK = '#5e6a4b';

function hash(s: string) {
	let h = 1779033703 ^ s.length;
	for (let i = 0; i < s.length; i++) {
		h = Math.imul(h ^ s.charCodeAt(i), 3432918353);
		h = (h << 13) | (h >>> 19);
	}
	return h >>> 0;
}
function rng(seed: number) {
	let a = seed;
	return () => {
		a |= 0;
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

const f = (n: number) => n.toFixed(1);

function tree(x: number, y: number, r: number, fill: string, trunk: string) {
	return `<rect x="${f(x - r * 0.06)}" y="${f(y - r * 0.4)}" width="${f(r * 0.12)}" height="${f(r * 0.9)}" fill="${trunk}"/><ellipse cx="${f(x)}" cy="${f(y - r * 0.9)}" rx="${f(r * 0.72)}" ry="${f(r)}" fill="${fill}"/>`;
}

function sky(W: number, H: number, t: (typeof TONES)[Tone], tone: Tone, r: () => number) {
	let s = `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.sky[0]}"/><stop offset="1" stop-color="${t.sky[1]}"/></linearGradient>
	<radialGradient id="sun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${t.haze}" stop-opacity="0.9"/><stop offset="1" stop-color="${t.haze}" stop-opacity="0"/></radialGradient>
	<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="${Math.floor(r() * 100)}"/><feColorMatrix values="0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0.09 0"/></filter></defs>
	<rect width="${W}" height="${H}" fill="url(#sky)"/>`;
	const sx = W * (0.15 + r() * 0.7);
	s += `<circle cx="${f(sx)}" cy="${f(H * (tone === 'day' ? 0.2 : 0.55))}" r="${f(W * 0.35)}" fill="url(#sun)"/>`;
	if (tone === 'night') {
		for (let i = 0; i < 60; i++)
			s += `<circle cx="${f(r() * W)}" cy="${f(r() * H * 0.5)}" r="${f(r() * 1.4 + 0.3)}" fill="#fff" opacity="${f(r() * 0.5 + 0.1)}"/>`;
	}
	return s;
}

function windows(
	x: number,
	y: number,
	w: number,
	h: number,
	floors: number,
	cols: number,
	t: (typeof TONES)[Tone],
	tone: Tone,
	r: () => number,
	fins = false
) {
	let s = '';
	const fh = h / floors;
	const cw = w / cols;
	for (let fl = 0; fl < floors; fl++) {
		const fy = y + fl * fh;
		s += `<rect x="${f(x)}" y="${f(fy)}" width="${f(w)}" height="${f(fh * 0.16)}" fill="${t.mass}"/>`;
		for (let c = 0; c < cols; c++) {
			const lit = (tone === 'dusk' || tone === 'night') && r() < (tone === 'night' ? 0.55 : 0.4);
			s += `<rect x="${f(x + c * cw + cw * 0.08)}" y="${f(fy + fh * 0.22)}" width="${f(cw * 0.84)}" height="${f(fh * 0.7)}" fill="${lit ? t.light : t.glass}" opacity="${lit ? 0.92 : 0.85}"/>`;
		}
		if (fl % 2 === 1)
			s += `<rect x="${f(x - w * 0.03)}" y="${f(fy + fh * 0.9)}" width="${f(w * 0.46)}" height="${f(fh * 0.1)}" fill="${t.mass}"/>`;
	}
	if (fins) {
		for (let c = 0; c <= cols; c++)
			s += `<rect x="${f(x + c * cw - cw * 0.05)}" y="${f(y)}" width="${f(cw * 0.1)}" height="${f(h)}" fill="${COPPER}" opacity="0.9"/>`;
	}
	return s;
}

function scene(name: string, kind: string, tone: Tone, W: number, H: number): string {
	const r = rng(hash(name));
	const t = TONES[tone];
	const gy = H * 0.8;
	let s = '';
	const dark = tone === 'dusk' || tone === 'night';
	const treeFill = dark ? '#2f3a2b' : SAGE;
	const treeFill2 = dark ? '#263024' : SAGE_DARK;
	const trunk = dark ? '#1c1f1c' : '#5a4a3c';

	if (kind === 'tower' || kind === 'commercial') {
		s += sky(W, H, t, tone, r);
		// distant skyline
		for (let i = 0; i < 14; i++) {
			const bw = W * (0.04 + r() * 0.06);
			const bh = H * (0.08 + r() * 0.22);
			s += `<rect x="${f(r() * W)}" y="${f(gy - bh)}" width="${f(bw)}" height="${f(bh)}" fill="${t.haze}" opacity="0.35"/>`;
		}
		s += `<rect y="${f(gy)}" width="${W}" height="${f(H - gy)}" fill="${t.ground}"/>`;
		if (kind === 'tower') {
			const towers = name.includes('tamarind') || name === 'hero_tower' ? 2 : 1;
			for (let i = 0; i < towers; i++) {
				const w = W * (0.17 + r() * 0.05);
				const floors = 12 + Math.floor(r() * 5);
				const h = H * (0.52 + r() * 0.12) * (i === 1 ? 0.82 : 1);
				const x = W * (towers === 2 ? (i === 0 ? 0.5 : 0.26) : 0.4 + r() * 0.1);
				s += `<rect x="${f(x - 6)}" y="${f(gy - h - 10)}" width="${f(w + 12)}" height="${f(h + 10)}" fill="${i === 1 ? t.mass2 : t.mass}"/>`;
				s += windows(x, gy - h, w, h, floors, 5, t, tone, r, i === 0);
				s += `<rect x="${f(x - 6)}" y="${f(gy - h - 22)}" width="${f(w * 0.4)}" height="12" fill="${t.mass2}"/>`;
			}
		} else {
			const w = W * 0.52;
			const h = H * 0.46;
			const x = W * 0.24;
			s += `<rect x="${f(x)}" y="${f(gy - h)}" width="${f(w)}" height="${f(h)}" fill="${t.glass}"/>`;
			s += windows(x, gy - h, w, h, 9, 16, t, tone, r, true);
			s += `<rect x="${f(x - 10)}" y="${f(gy - h - 16)}" width="${f(w + 20)}" height="16" fill="${t.mass}"/>`;
			s += `<rect x="${f(x)}" y="${f(gy - h * 0.12)}" width="${f(w)}" height="${f(h * 0.12)}" fill="${t.light}" opacity="${dark ? 0.8 : 0.35}"/>`;
		}
		for (let i = 0; i < 9; i++)
			s += tree(
				r() * W,
				gy + H * 0.02 + r() * H * 0.08,
				H * (0.05 + r() * 0.05),
				i % 2 ? treeFill : treeFill2,
				trunk
			);
	} else if (kind === 'villa') {
		s += sky(W, H, t, tone, r);
		s += `<rect y="${f(gy)}" width="${W}" height="${f(H - gy)}" fill="${t.ground}"/>`;
		for (let i = 0; i < 6; i++)
			s += tree(r() * W, gy - H * 0.01, H * (0.12 + r() * 0.08), treeFill2, trunk);
		const count = name.includes('ivory') ? 4 : 2;
		for (let i = 0; i < count; i++) {
			const w = W * (count === 4 ? 0.19 : 0.34);
			const x = W * 0.06 + i * (w + W * 0.03);
			const h1 = H * 0.2;
			const h2 = H * 0.17;
			const brick = name.includes('terracotta');
			const wall = brick ? '#a4583a' : t.mass;
			s += `<rect x="${f(x)}" y="${f(gy - h1)}" width="${f(w)}" height="${f(h1)}" fill="${wall}"/>`;
			s += `<rect x="${f(x + w * 0.25)}" y="${f(gy - h1 - h2)}" width="${f(w * 0.75)}" height="${f(h2)}" fill="${brick ? '#8f4a30' : t.mass2}"/>`;
			s += `<rect x="${f(x - w * 0.04)}" y="${f(gy - h1 - h2 - 10)}" width="${f(w * 1.08)}" height="10" fill="${t.ink}" opacity="0.85"/>`;
			s += `<rect x="${f(x - w * 0.02)}" y="${f(gy - h1 - 6)}" width="${f(w * 1.04)}" height="8" fill="${t.ink}" opacity="0.75"/>`;
			const lit = dark ? t.light : t.glass;
			s += `<rect x="${f(x + w * 0.08)}" y="${f(gy - h1 * 0.8)}" width="${f(w * 0.5)}" height="${f(h1 * 0.72)}" fill="${lit}" opacity="0.9"/>`;
			s += `<rect x="${f(x + w * 0.35)}" y="${f(gy - h1 - h2 * 0.8)}" width="${f(w * 0.45)}" height="${f(h2 * 0.6)}" fill="${lit}" opacity="0.8"/>`;
			for (let p = 0; p < 7; p++)
				s += `<rect x="${f(x + w * 0.25 + p * w * 0.1)}" y="${f(gy - h1 - h2 - 10)}" width="3" height="${f(h2 * 0.2)}" fill="${t.ink}" opacity="0.6"/>`;
		}
		s += `<rect y="${f(gy)}" width="${W}" height="${f(H * 0.03)}" fill="${t.mass2}"/>`;
		for (let i = 0; i < 7; i++)
			s += tree(r() * W, gy + H * 0.12 + r() * H * 0.05, H * (0.04 + r() * 0.04), treeFill, trunk);
	} else if (kind === 'plots' || kind === 'landscape') {
		s += sky(W, H, t, tone, r);
		const hz = H * 0.42;
		s += `<rect y="${f(hz)}" width="${W}" height="${f(H - hz)}" fill="${t.ground}"/>`;
		const vx = W * 0.5;
		if (kind === 'plots') {
			// perspective plot grid
			for (let i = -10; i <= 10; i++)
				s += `<line x1="${f(vx + i * W * 0.012)}" y1="${f(hz)}" x2="${f(vx + i * W * 0.2)}" y2="${H}" stroke="${t.mass}" stroke-width="2" opacity="0.8"/>`;
			for (let j = 1; j < 12; j++) {
				const yy = hz + (H - hz) * Math.pow(j / 12, 1.8);
				s += `<line x1="0" y1="${f(yy)}" x2="${W}" y2="${f(yy)}" stroke="${t.mass}" stroke-width="${f(1 + j * 0.25)}" opacity="0.7"/>`;
			}
			s += `<polygon points="${f(vx - 6)},${f(hz)} ${f(vx + 6)},${f(hz)} ${f(vx + W * 0.16)},${H} ${f(vx - W * 0.16)},${H}" fill="${t.ink}" opacity="0.75"/>`;
			s += `<polygon points="${f(vx - 1)},${f(hz)} ${f(vx + 1)},${f(hz)} ${f(vx + 6)},${H} ${f(vx - 6)},${H}" fill="${t.light}" opacity="0.7"/>`;
		} else {
			s += `<polygon points="${f(vx - 8)},${f(hz)} ${f(vx + 8)},${f(hz)} ${f(vx + W * 0.28)},${H} ${f(vx - W * 0.28)},${H}" fill="${t.mass2}"/>`;
		}
		for (let j = 0; j < 12; j++) {
			const d = Math.pow((j + 1) / 12, 1.7);
			const yy = hz + (H - hz) * d;
			const off = W * (0.03 + d * (kind === 'plots' ? 0.2 : 0.34));
			const rad = H * (0.02 + d * 0.16);
			s +=
				tree(vx - off, yy, rad, j % 2 ? treeFill : treeFill2, trunk) +
				tree(vx + off, yy, rad, j % 2 ? treeFill2 : treeFill, trunk);
		}
	} else if (kind === 'site') {
		s += sky(W, H, t, tone, r);
		s += `<rect y="${f(gy)}" width="${W}" height="${f(H - gy)}" fill="${t.ground}"/>`;
		const x0 = W * 0.28;
		const bw = W * 0.4;
		const floors = name.includes('foundation') ? 2 : 9;
		const fh = H * 0.055;
		for (let fl = 0; fl <= floors; fl++) {
			const yy = gy - fl * fh;
			s += `<rect x="${f(x0 - 8)}" y="${f(yy - 7)}" width="${f(bw + 16)}" height="7" fill="${t.mass}"/>`;
			if (fl < floors)
				for (let c = 0; c <= 6; c++)
					s += `<rect x="${f(x0 + (c * bw) / 6 - 3)}" y="${f(yy - fh)}" width="6" height="${f(fh)}" fill="${t.mass2}"/>`;
		}
		// scaffolding & crane
		for (let c = 0; c < 20; c++)
			s += `<line x1="${f(x0 + bw + 16)}" y1="${f(gy - (c * fh * floors) / 20)}" x2="${f(x0 + bw + 40)}" y2="${f(gy - ((c + 1) * fh * floors) / 20)}" stroke="${t.ink}" stroke-width="1.5" opacity="0.5"/>`;
		const cx = W * 0.72;
		const top = H * 0.12;
		s += `<rect x="${f(cx)}" y="${f(top)}" width="14" height="${f(gy - top)}" fill="${COPPER}"/>`;
		for (let i = 0; i < 24; i++)
			s += `<line x1="${f(cx)}" y1="${f(top + i * ((gy - top) / 24))}" x2="${f(cx + 14)}" y2="${f(top + (i + 1) * ((gy - top) / 24))}" stroke="${t.ink}" stroke-width="1" opacity="0.6"/>`;
		s += `<rect x="${f(cx - W * 0.42)}" y="${f(top)}" width="${f(W * 0.52)}" height="10" fill="${COPPER}"/>`;
		s += `<line x1="${f(cx - W * 0.25)}" y1="${f(top + 10)}" x2="${f(cx - W * 0.25)}" y2="${f(top + H * 0.3)}" stroke="${t.ink}" stroke-width="1.5"/>`;
		s += `<rect x="${f(cx - W * 0.25 - 16)}" y="${f(top + H * 0.3)}" width="32" height="14" fill="${t.ink}" opacity="0.8"/>`;
		s += `<rect x="${f(cx + W * 0.06)}" y="${f(top - 6)}" width="${f(W * 0.05)}" height="20" fill="${t.ink}"/>`;
	} else if (kind === 'amenity') {
		s += sky(W, H, t, tone, r);
		const py = H * 0.58;
		s += `<rect y="${f(H * 0.5)}" width="${W}" height="${f(H * 0.5)}" fill="${t.mass2}"/>`;
		s += `<defs><linearGradient id="pool" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${dark ? '#26434a' : '#8fb7b3'}"/><stop offset="1" stop-color="${dark ? '#122226' : '#4f8a88'}"/></linearGradient></defs>`;
		s += `<rect x="${f(W * 0.08)}" y="${f(py)}" width="${f(W * 0.84)}" height="${f(H * 0.26)}" fill="url(#pool)"/>`;
		for (let i = 0; i < 14; i++)
			s += `<line x1="${f(W * 0.1 + r() * W * 0.7)}" y1="${f(py + r() * H * 0.25)}" x2="${f(W * 0.1 + r() * W * 0.8)}" y2="${f(py + r() * H * 0.25)}" stroke="#fff" stroke-width="1.5" opacity="0.25"/>`;
		s += `<rect x="0" y="${f(H * 0.18)}" width="${f(W * 0.36)}" height="${f(H * 0.32)}" fill="${t.mass}"/>`;
		s += windows(W * 0.02, H * 0.22, W * 0.3, H * 0.26, 3, 4, t, tone, r);
		for (let i = 0; i < 4; i++)
			s += `<rect x="${f(W * 0.5 + i * W * 0.1)}" y="${f(H * 0.52)}" width="${f(W * 0.07)}" height="${f(H * 0.025)}" fill="${t.ink}" opacity="0.7"/>`;
		for (let i = 0; i < 5; i++)
			s += tree(W * (0.45 + r() * 0.55), H * 0.5, H * (0.12 + r() * 0.06), treeFill2, trunk);
	} else if (kind === 'interior') {
		const wall = dark ? '#3a3632' : '#ece4d6';
		const floor = dark ? '#2a2724' : '#cdbfa7';
		s += `<defs><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2"/><feColorMatrix values="0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0.09 0"/></filter>
		<linearGradient id="win" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.sky[0]}"/><stop offset="1" stop-color="${t.sky[1]}"/></linearGradient>
		<linearGradient id="fl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${floor}"/><stop offset="1" stop-color="${dark ? '#1d1b19' : '#b3a38a'}"/></linearGradient></defs>`;
		s += `<rect width="${W}" height="${H}" fill="${wall}"/>`;
		const by = H * 0.68;
		s += `<polygon points="0,${H} ${f(W * 0.14)},${f(by)} ${f(W * 0.86)},${f(by)} ${W},${H}" fill="url(#fl)"/>`;
		s += `<polygon points="0,0 ${f(W * 0.14)},${f(H * 0.12)} ${f(W * 0.14)},${f(by)} 0,${H}" fill="${t.ink}" opacity="0.12"/>`;
		s += `<rect x="${f(W * 0.3)}" y="${f(H * 0.16)}" width="${f(W * 0.5)}" height="${f(H * 0.46)}" fill="url(#win)"/>`;
		for (let i = 1; i < 4; i++)
			s += `<rect x="${f(W * 0.3 + (i * W * 0.5) / 4 - 2)}" y="${f(H * 0.16)}" width="4" height="${f(H * 0.46)}" fill="${t.ink}" opacity="0.7"/>`;
		s += tree(W * 0.62, H * 0.62, H * 0.12, treeFill, trunk);
		s += `<rect x="${f(W * 0.24)}" y="${f(H * 0.66)}" width="${f(W * 0.34)}" height="${f(H * 0.1)}" rx="10" fill="${dark ? '#6b5d50' : '#d9cbb3'}"/>`;
		s += `<rect x="${f(W * 0.22)}" y="${f(H * 0.61)}" width="${f(W * 0.38)}" height="${f(H * 0.07)}" rx="12" fill="${dark ? '#7b6b5c' : '#e6dac5'}"/>`;
		s += `<rect x="${f(W * 0.64)}" y="${f(H * 0.72)}" width="${f(W * 0.14)}" height="${f(H * 0.035)}" fill="${COPPER}"/>`;
		s += `<line x1="${f(W * 0.45)}" y1="0" x2="${f(W * 0.45)}" y2="${f(H * 0.3)}" stroke="${t.ink}" stroke-width="1.5"/>`;
		s += `<ellipse cx="${f(W * 0.45)}" cy="${f(H * 0.31)}" rx="${f(W * 0.04)}" ry="${f(H * 0.02)}" fill="${t.light}"/>`;
		s += `<rect x="${f(W * 0.84)}" y="${f(H * 0.2)}" width="${f(W * 0.1)}" height="${f(H * 0.48)}" fill="${dark ? '#4a3b31' : '#b88f6f'}"/>`;
	} else if (kind === 'plan') {
		const paper = '#f4efe6';
		const ink = '#2c3034';
		s += `<defs><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2"/><feColorMatrix values="0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0.06 0"/></filter>
		<pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#c7b89f" stroke-width="0.6"/></pattern></defs>`;
		s += `<rect width="${W}" height="${H}" fill="${paper}"/><rect width="${W}" height="${H}" fill="url(#g)" opacity="0.6"/>`;
		const x0 = W * 0.14;
		const y0 = H * 0.14;
		const pw = W * 0.72;
		const ph = H * 0.68;
		s += `<rect x="${f(x0)}" y="${f(y0)}" width="${f(pw)}" height="${f(ph)}" fill="none" stroke="${ink}" stroke-width="10"/>`;
		const cols = 2 + Math.floor(r() * 2);
		const labels = ['LIVING', 'BED 1', 'BED 2', 'KITCHEN', 'DINING', 'BATH', 'BED 3', 'UTILITY'];
		let li = 0;
		for (let c = 1; c < cols; c++)
			s += `<line x1="${f(x0 + (c * pw) / cols)}" y1="${f(y0)}" x2="${f(x0 + (c * pw) / cols)}" y2="${f(y0 + ph)}" stroke="${ink}" stroke-width="6"/>`;
		for (let c = 0; c < cols; c++) {
			const split = 0.4 + r() * 0.2;
			s += `<line x1="${f(x0 + (c * pw) / cols)}" y1="${f(y0 + ph * split)}" x2="${f(x0 + ((c + 1) * pw) / cols)}" y2="${f(y0 + ph * split)}" stroke="${ink}" stroke-width="6"/>`;
			for (const [yy, hh] of [
				[y0, ph * split],
				[y0 + ph * split, ph * (1 - split)]
			] as const) {
				s += `<text x="${f(x0 + ((c + 0.5) * pw) / cols)}" y="${f(yy + hh / 2)}" font-family="monospace" font-size="${f(W * 0.016)}" letter-spacing="3" text-anchor="middle" fill="${ink}" opacity="0.8">${labels[li++ % labels.length]}</text>`;
				const dx = x0 + (c * pw) / cols + 18;
				s += `<path d="M${f(dx)} ${f(yy + hh - 8)} a50 50 0 0 1 50 -50" fill="none" stroke="${COPPER}" stroke-width="2"/>`;
			}
		}
		s += `<line x1="${f(x0)}" y1="${f(y0 + ph + 40)}" x2="${f(x0 + pw)}" y2="${f(y0 + ph + 40)}" stroke="${COPPER}" stroke-width="1.5"/>`;
		s += `<line x1="${f(x0)}" y1="${f(y0 + ph + 30)}" x2="${f(x0)}" y2="${f(y0 + ph + 50)}" stroke="${COPPER}" stroke-width="1.5"/><line x1="${f(x0 + pw)}" y1="${f(y0 + ph + 30)}" x2="${f(x0 + pw)}" y2="${f(y0 + ph + 50)}" stroke="${COPPER}" stroke-width="1.5"/>`;
		s += `<text x="${f(x0 + pw / 2)}" y="${f(y0 + ph + 32)}" font-family="monospace" font-size="${f(W * 0.014)}" text-anchor="middle" fill="${COPPER}">DIMENSIONS INDICATIVE</text>`;
		s += `<circle cx="${f(W * 0.92)}" cy="${f(H * 0.1)}" r="26" fill="none" stroke="${ink}" stroke-width="1.5"/><path d="M${f(W * 0.92)} ${f(H * 0.1 - 22)} l8 30 h-16z" fill="${ink}"/>`;
		return s;
	} else if (kind === 'portrait') {
		const bg = [t.sky[1], t.sky[0]];
		s += `<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${bg[0]}"/><stop offset="1" stop-color="${bg[1]}"/></linearGradient>
		<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2"/><feColorMatrix values="0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0.09 0"/></filter></defs>`;
		s += `<rect width="${W}" height="${H}" fill="url(#bg)"/>`;
		const figure = dark ? '#c7b89f' : '#43484d';
		s += `<circle cx="${f(W * 0.5)}" cy="${f(H * 0.4)}" r="${f(W * 0.17)}" fill="${figure}" opacity="0.85"/>`;
		s += `<path d="M${f(W * 0.12)} ${H} C ${f(W * 0.14)} ${f(H * 0.66)}, ${f(W * 0.86)} ${f(H * 0.66)}, ${f(W * 0.88)} ${H} Z" fill="${figure}" opacity="0.85"/>`;
		s += `<text x="${f(W * 0.5)}" y="${f(H * 0.12)}" font-family="monospace" font-size="${f(W * 0.035)}" letter-spacing="4" text-anchor="middle" fill="${dark ? '#f4efe6' : '#2c3034'}" opacity="0.7">PORTRAIT</text>`;
	}
	return s;
}

function svgFor(name: string, spec: { w: number; h: number; kind: string; tone: string }) {
	const { w: W, h: H, kind } = spec;
	const tone = spec.tone as Tone;
	const body = scene(name, kind, tone, W, H);
	const fs = Math.max(13, Math.round(W * 0.011));
	const label = `DEMO IMAGE · REPLACE IN SANITY · ${name.toUpperCase()}`;
	const lw = label.length * fs * 0.62 + fs * 2;
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${body}
<rect width="${W}" height="${H}" filter="url(#grain)"/>
<g transform="translate(${fs * 1.6} ${H - fs * 3.4})"><rect width="${f(lw)}" height="${fs * 2}" fill="#16181a" opacity="0.72"/><text x="${fs}" y="${fs * 1.36}" font-family="monospace" font-size="${fs}" textLength="${f(lw - fs * 2)}" lengthAdjust="spacingAndGlyphs" fill="#f4efe6">${label}</text></g>
</svg>`;
}

for (const [name, spec] of Object.entries(DEMO_IMAGES)) {
	const svg = Buffer.from(svgFor(name, spec));
	await sharp(svg)
		.jpeg({ quality: 80, mozjpeg: true })
		.toFile(resolve(outDir, `${name}.jpg`));
	await sharp(svg)
		.resize({ width: 800 })
		.jpeg({ quality: 76, mozjpeg: true })
		.toFile(resolve(outDir, `${name}-800.jpg`));
	console.log('✓', name);
}

/* Minimal, valid one-page PDF used as the demo brochure. */
function pdf(lines: string[]) {
	const text = lines
		.map(
			(l, i) =>
				`BT /F1 ${i === 0 ? 22 : 12} Tf 72 ${720 - i * 28} Td (${l.replace(/[()\\]/g, '')}) Tj ET`
		)
		.join('\n');
	const objs = [
		'<< /Type /Catalog /Pages 2 0 R >>',
		'<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
		'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
		`<< /Length ${text.length} >>\nstream\n${text}\nendstream`,
		'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'
	];
	let out = '%PDF-1.4\n';
	const offsets: number[] = [];
	objs.forEach((o, i) => {
		offsets.push(out.length);
		out += `${i + 1} 0 obj\n${o}\nendobj\n`;
	});
	const xref = out.length;
	out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${offsets.map((o) => `${String(o).padStart(10, '0')} 00000 n \n`).join('')}`;
	out += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
	return out;
}
writeFileSync(
	resolve(outDir, 'brochure_sample.pdf'),
	pdf([
		'Spacecraft Associates - Sample project brochure',
		'DEMO DOCUMENT: replace with the real brochure in Sanity Studio.',
		'Open the project in Studio > Media > Brochure and upload your PDF.',
		'Plans, prices and specifications in a real brochure must match the agreement.'
	])
);
console.log('✓ brochure_sample.pdf');
