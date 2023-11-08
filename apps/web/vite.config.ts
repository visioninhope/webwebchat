import { fileURLToPath, URL } from "url";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig, loadEnv } from 'vite';
import { comlink } from 'vite-plugin-comlink'


// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, `${process.cwd()}/../../`) };
  // console.log('🛑🛑🛑vite.config.ts🛑🛑🛑')
  // console.log('mode', mode)
  // console.log('process.env.VITE_ENV_HELLO', process.env.VITE_ENV_HELLO)
  return defineConfig({
    envDir: "../../",
    plugins: [svelte(), comlink()],
    worker: {
      plugins: [
        comlink()
      ]
    },
    resolve: {
      alias: {
        '$lib': fileURLToPath(new URL('./src/lib/', import.meta.url))
      }
    }
  });
}