import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// El frontend llama a /api y Vite lo redirige al backend (Express, puerto 3000)
const api = { '/api': 'http://localhost:3000' };

export default defineConfig({
  plugins: [react()],
  server: { proxy: api },
  preview: { proxy: api }
});
