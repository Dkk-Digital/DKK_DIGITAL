import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.VERCEL === '1' ? '/' : './',
  plugins: [
    react(),
  ],
  server: {
    host: true, // Listens on all local IPs (essential for Android/iOS testing via Capacitor)
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});


