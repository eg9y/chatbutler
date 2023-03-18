import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import eslint from 'vite-plugin-eslint';
import { tscPlugin } from 'vite-plugin-tsc-watch';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		eslint(),
		react(),
		{
			...tscPlugin(),
			enforce: 'post',
		},
	],
});
