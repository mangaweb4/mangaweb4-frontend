import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit'

export default defineConfig(({ command, mode }) => {
	const env = loadEnv(mode, process.cwd(), '');

	return {
		plugins: [
			sveltekit(),
			SvelteKitPWA({
				srcDir: './src',
				mode: 'development',
				// you don't need to do this if you're using generateSW strategy in your app
				//strategies: generateSW ? 'generateSW' : 'injectManifest',
				// you don't need to do this if you're using generateSW strategy in your app
				//filename: generateSW ? undefined : 'prompt-sw.ts',
				scope: '/',
				base: '/',
				selfDestroying: process.env.SELF_DESTROYING_SW === 'true',
				pwaAssets: {
					config: true,
				},
				manifest: {
					short_name: 'MangaWeb 3',
					name: 'MangaWeb 3',
					start_url: '/',
					scope: '/',
					display: 'standalone',
					theme_color: '#ffffff',
					background_color: '#000000',
				},
				injectManifest: {
					globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}'],
				},
				workbox: {
					globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}'],
				},
				devOptions: {
					enabled: false,
					suppressWarnings: process.env.SUPPRESS_WARNING === 'true',
					type: 'module',
					navigateFallback: '/',
				},
				// if you have shared info in svelte config file put in a separate module and use it also here
				kit: {
					includeVersionFile: true,
				},
			})
		],
		ssr: { noExternal: ['@popperjs/core'] },
		test: {
			include: ['src/**/*.{test,spec}.{js,ts}']
		},
		server: {
			proxy: {
				'/api': {
					target: env.BACKEND_URL ? env.BACKEND_URL : 'http://localhost:8972',
					rewrite: (path) => path.replace(/^\/api/, ''),
					changeOrigin: true,
				}
			}
		}
	}
});
