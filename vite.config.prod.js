import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Production config for custom domain (wasl.bio)
// Use this for building: npm run build:prod
export default defineConfig({
  plugins: [react()],
  base: '/', // Root path for custom domain
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  publicDir: 'public',
})
