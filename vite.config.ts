import mdx from '@mdx-js/rollup';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import remarkPlugin from 'remark-gfm';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import svgr from 'vite-plugin-svgr';
import topLevelAwait from 'vite-plugin-top-level-await';
import { tscPlugin } from 'vite-plugin-tsc-watch';
import vercel from 'vite-plugin-vercel';
import wasm from 'vite-plugin-wasm';

const root = resolve(__dirname, 'src/pages/');
const outDir = resolve(__dirname, 'dist');

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		eslint({
			fix: true,
		}),
		{
			enforce: 'pre',
			...mdx({
				providerImportSource: '@mdx-js/react',
				remarkPlugins: [remarkPlugin],
			}),
		},
		wasm(),
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
				editor: resolve(root, 'app', 'index.html'),
				files: resolve(root, 'files', 'index.html'),
				gallery: resolve(root, 'gallery', 'index.html'),
				chat: resolve(root, 'chat', 'index.html'),
				auth: resolve(root, 'auth', 'index.html'),
			},
		},
	},
});
