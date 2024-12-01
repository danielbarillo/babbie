import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const apiUrl = 'https://chappyv.onrender.com';

  console.log('Mode:', mode)
  console.log('Forced API URL:', apiUrl)

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(apiUrl),
      'import.meta.env.MODE': JSON.stringify(mode)
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
          },
        },
      },
    },
    server: {
      port: 5173,
      proxy: {
        '/': {
          target: apiUrl,
          changeOrigin: true,
        },
      },
    },
    base: '/',
  }
});