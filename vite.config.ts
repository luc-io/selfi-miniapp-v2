import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Import Tailwind CSS plugin
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
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