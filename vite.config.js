import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Allows Cloudflare tunnels or any tunnel host to reach your Vite dev server
    allowedHosts: ['.trycloudflare.com']
  }
})