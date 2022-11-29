import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    port: 3000,
    host: true,
    strictPort: true,
    hmr: {
      clientPort: 3000,
    },
  },
})
