import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Tailwind is configured through PostCSS, no need for direct import
export default defineConfig({
  plugins: [react()],
  server: {
    https: true,
    port: 5173,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});