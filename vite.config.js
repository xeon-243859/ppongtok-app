import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/ppongtok-app/', // GitHub Pages용 경로
  plugins: [react()]
});
