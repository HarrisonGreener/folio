import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Served from https://harrisongreener.github.io/folio/ on GitHub Pages.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/folio/' : '/',
  plugins: [react()],
  server: { port: 3000, host: '0.0.0.0' },
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 6000,
  },
  optimizeDeps: {
    exclude: ['@mlc-ai/web-llm'],
  },
}));
