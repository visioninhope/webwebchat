import { fileURLToPath, URL } from "url";
import { resolve } from 'path';
import { crx } from "@crxjs/vite-plugin";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig, loadEnv } from 'vite';
import manifest from "./src/manifest.config";
import { comlink } from 'vite-plugin-comlink'


// https://vitejs.dev/config/
export default ({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, `${process.cwd()}/../../`) };

    // console.log('🛑🛑🛑vite.config.ts🛑🛑🛑')
    // console.log('mode', mode)
    // console.log('process.env.VITE_ENV_HELLO', process.env.VITE_ENV_HELLO)

    return defineConfig({
        build: {
            rollupOptions: {
                input: {
                    welcome: resolve(__dirname, 'index.html'),

                    // not required anymore registerMainWorldScript handles this
                    // "main-world": 'src/_bg/MAIN_WORLD/main_frame_script.ts',
                    // https://github.com/crxjs/chrome-extension-tools/issues/695
                    // https://dev.to/jacksteamdev/advanced-config-for-rpce-3966#main-world-scripts
                },
            },
        },
        envDir: "../../",
        plugins: [svelte(), crx({ manifest }), comlink()],
        worker: {
            plugins: [
                comlink()
            ]
        },
        // HACK: https://github.com/crxjs/chrome-extension-tools/issues/696
        // https://github.com/crxjs/chrome-extension-tools/issues/746
        server: {
            port: 4173,
            strictPort: true,
            hmr: {
                clientPort: 4173,
            },
        },
        resolve: {
            alias: {
                '$lib': fileURLToPath(new URL('./src/lib/', import.meta.url))
            }
        }
    });
}