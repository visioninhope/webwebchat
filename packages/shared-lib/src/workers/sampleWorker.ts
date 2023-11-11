/// <reference types="vite-plugin-comlink/client" />

export async function helloSampleWorker(name: string) {
    await new Promise(resolve => setTimeout(resolve, 3000));
    return `Hello ${name}!`;
}