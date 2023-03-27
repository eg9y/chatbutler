import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import Pages from 'vite-plugin-pages';
import svgr from 'vite-plugin-svgr';
import { tscPlugin } from 'vite-plugin-tsc-watch';
import vercel from 'vite-plugin-vercel';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		eslint({
			fix: true,
		}),
		react(),
		svgr({
			esbuildOptions: { loader: 'tsx' },
		}),
		vercel(),
		{
			...tscPlugin(),
			enforce: 'post',
		},
		Pages({
			dirs: [
				{ dir: 'src/pages/app', baseRoute: '' },
				{ dir: 'src/pages/gallery', baseRoute: 'gallery' },
				{ dir: 'src/pages/auth', baseRoute: 'auth' },
			],
		}),
	],
});
