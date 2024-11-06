import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: '/src' },
      { find: '@component', replacement: '/src/component' },
      { find: '@boundary', replacement: '/src/boundary' }
    ]
  },
  server: {
    port: 5173,
    open: true,
    host: true
  }
});
