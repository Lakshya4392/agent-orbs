import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@agent-orbs/core': path.resolve(__dirname, '../../packages/core/src'),
      '@agent-orbs/react': path.resolve(__dirname, '../../packages/react/src'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
