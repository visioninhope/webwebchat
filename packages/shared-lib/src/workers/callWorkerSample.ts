
export const callWorkerSample = async () => {
    console.log(new URL("./sampleWorker", import.meta.url))
    // const instance = new ComlinkWorker<
    //     typeof import("./sampleWorker")
    // >(new URL("./sampleWorker", import.meta.url), {
    //     /* normal Worker options*/
    // });
    // console.log(await instance.helloSampleWorker("world"));
}

// const hello = async () => {
// 	await callWorkerSample();
// };
// <button on:click={hello}>hello worker world</button>
