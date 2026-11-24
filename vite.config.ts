import { defineConfig } from 'vitest/config';
import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';

// Tests always run in demo mode, against the local seed, never against the live Sanity project
// in .env (the lead tests would otherwise create real leads). This must happen before SvelteKit
// reads the environment, so it cannot live in `test.env`.
if (process.env.VITEST) {
	for (const key of [
		'PUBLIC_SANITY_PROJECT_ID',
		'SANITY_API_READ_TOKEN',
		'SANITY_API_WRITE_TOKEN',
		'INSTAGRAM_ACCESS_TOKEN',
		'LEAD_NOTIFY_WEBHOOK_URL'
	])
		process.env[key] = '';
}

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
			// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
			// See https://svelte.dev/docs/kit/adapters for more information about adapters.
			adapter: adapter()
		})
	],
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
