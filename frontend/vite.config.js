import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: mode === 'development' ? {
    proxy: {
      '/api': 'http://localhost:8080', // Solo en desarrollo
    },
  } : {},
}));
