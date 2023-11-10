import { fileURLToPath, URL } from "url";
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  // root: 'lib',
  plugins: [svelte()],
  resolve: {
    alias: {
      '$lib': fileURLToPath(new URL('./src/', import.meta.url))
    }
  }
})
