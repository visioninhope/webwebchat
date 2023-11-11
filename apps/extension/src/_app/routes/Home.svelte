<script lang="ts">
	import { isDevMode } from "shared-lib/src/utils/dev";
	import LogoWebWebChat from "shared-lib/src/components/logos/LogoWebWebChat.svelte";
	import { callWorkerSample } from "shared-lib/src/workers/callWorkerSample";

	const hello = async () => {
		await callWorkerSample();
	};
</script>

<h1>
	<i class="text-2xl mr-2 text-primary">
		<LogoWebWebChat />
	</i>
</h1>
<h1>Welcome isDevMode:{isDevMode}</h1>
<button on:click={hello}>hello</button>
