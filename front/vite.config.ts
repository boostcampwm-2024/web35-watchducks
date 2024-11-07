import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: '/src' },
      { find: '@component', replacement: '/src/component' },
      { find: '@boundary', replacement: '/src/boundary' },
      { find: '@hook', replacement: '/src/hook' },
      { find: '@type', replacement: '/src/type' },
      { find: '@util', replacement: '/src/util' },
      { find: '@api', replacement: '/src/api' },
      { find: '@asset', replacement: '/asset' }
    ]
  },
  server: {
    port: 5173,
    open: true,
    host: true
  }
});
