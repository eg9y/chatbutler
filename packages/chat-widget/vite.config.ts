import { preact } from '@preact/preset-vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [preact()],
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
  build: {
    // existing build configuration
    lib: {
      entry: 'src/main.tsx',
      name: 'ChatBot',
      formats: ['iife'], // iife or umd
    },
  },
  css: {
    preprocessorOptions: {
      includePaths: ["./src"],
    },
  },
})