import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import { tscPlugin } from 'vite-plugin-tsc-watch';
import vercel from 'vite-plugin-vercel';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		eslint({
			fix: true,
		}),
		react(),
		vercel(),
		{
			...tscPlugin(),
			enforce: 'post',
		},
	],
});
