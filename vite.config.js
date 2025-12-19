import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/media-page/' : '/',
  // If your repo name is different, change '/media-page/' to '/your-repo-name/'
})
