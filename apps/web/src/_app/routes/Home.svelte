<script lang="ts">
	import { isDevMode } from "shared-lib/src/utils/dev";
	import LogoWebWebChat from "shared-lib/src/components/logos/LogoWebWebChat.svelte";
</script>

<h1>
	<i class="text-2xl mr-2 text-primary">
		<LogoWebWebChat />
	</i>
</h1>
<h1>Welcome isDevMode:{isDevMode}</h1>
