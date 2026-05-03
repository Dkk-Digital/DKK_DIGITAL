import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import electron from 'vite-plugin-electron/simple';

export default defineConfig({
  base: process.env.VERCEL === '1' ? '/' : './',
  plugins: [
    react(),
    process.env.VERCEL !== '1' && electron({
      main: {
        entry: 'electron/main.js',
      },
      preload: {
        input: 'electron/preload.js',
      },
    }),
  ].filter(Boolean),
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


