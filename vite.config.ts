import react from '@vitejs/plugin-react-swc';
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
});
