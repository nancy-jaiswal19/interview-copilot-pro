import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  define: { 'process.env.NODE_ENV': '"production"' },
  build: {
    emptyOutDir: false, // Important: don't delete what the other build did
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'src/content/index.jsx'),
      formats: ['iife'],
      name: 'AIAssistant',
      fileName: () => 'content.js',
    },
  },
});