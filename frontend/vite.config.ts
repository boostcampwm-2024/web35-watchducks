import basicSsl from '@vitejs/plugin-basic-ssl';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), basicSsl()],
  resolve: {
    alias: [
      { find: '@', replacement: '/src' },
      { find: '@component', replacement: '/src/component' },
      { find: '@boundary', replacement: '/src/boundary' },
      { find: '@hook', replacement: '/src/hook' },
      { find: '@type', replacement: '/src/type' },
      { find: '@constant', replacement: '/src/constant' },
      { find: '@util', replacement: '/src/util' },
      { find: '@api', replacement: '/src/api' },
      { find: '@chart', replacement: '/src/chart' },
      { find: '@store', replacement: '/src/store' },
      { find: '@router', replacement: '/src/router' },
      { find: '@asset', replacement: '/asset' }
    ]
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
          charts: ['apexcharts', 'react-apexcharts', '@nivo/calendar'],
          ui: ['react-error-boundary', 'react-toastify', 'motion'],
          utils: ['axios', 'lodash-es', 'zustand']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  server: {
    port: 5173,
    open: true,
    host: true
  }
});
