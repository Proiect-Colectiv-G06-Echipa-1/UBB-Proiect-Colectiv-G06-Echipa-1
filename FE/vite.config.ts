import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
<<<<<<< HEAD
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: {
      usePolling: true,  // Enable polling for Docker
      interval: 1000,    // Check every second
    },
    hmr: {
      host: 'localhost',
      port: 5173,
    },
  },
=======
>>>>>>> production
})
