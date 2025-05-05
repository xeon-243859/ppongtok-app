import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // ⚠️ Vercel 배포 시 경로 깨짐 방지
});
