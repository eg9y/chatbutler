import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
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
	],
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'index.html'),
				gallery: resolve(__dirname, 'src/pages/gallery.html'),
				auth: resolve(__dirname, 'src/pages/auth.html'),
			},
		},
	},
});
