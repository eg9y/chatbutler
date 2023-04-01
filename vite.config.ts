import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import svgr from 'vite-plugin-svgr';
import topLevelAwait from 'vite-plugin-top-level-await';
import { tscPlugin } from 'vite-plugin-tsc-watch';
import vercel from 'vite-plugin-vercel';

const root = resolve(__dirname, 'src/pages/');
const outDir = resolve(__dirname, 'dist');

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		eslint({
			fix: true,
		}),
		topLevelAwait(),
		react(),
		svgr({
			esbuildOptions: { loader: 'tsx' },
		}),
		vercel(),
		{
			...tscPlugin(),
			enforce: 'post',
		},
	],

	root,
	build: {
		outDir,
		emptyOutDir: true,
		rollupOptions: {
			input: {
				main: resolve(root, 'index.html'),
				files: resolve(root, 'files', 'index.html'),
				gallery: resolve(root, 'gallery', 'index.html'),
				auth: resolve(root, 'auth', 'index.html'),
			},
		},
	},
});
