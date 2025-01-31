import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// We're using PostCSS config instead of direct Tailwind plugin
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