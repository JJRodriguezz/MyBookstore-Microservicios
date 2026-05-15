import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '^/(books|users|orders|inventory|reviews|auth)': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
