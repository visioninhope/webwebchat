<script lang="ts">
	import { isDevMode } from "$lib/utils/dev";
	// import { BASE_NAV } from "$lib/constants/BASE_NAV";

	const hello = async () => {
		const instance = new ComlinkWorker<typeof import("./sampleWorker")>(
			new URL("./sampleWorker", import.meta.url),
			{
				/* normal Worker options*/
			}
		);
		console.log(await instance.helloSampleWorker("world"));
	};
</script>

<h1>Welcome {isDevMode}</h1>

<button on:click={hello}>hello</button>
