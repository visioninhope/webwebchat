<script lang="ts">
	import PasswordInputWrapper from "shared-lib/src/components/PasswordInputWrapper.svelte";
	import { appStateStore } from "$lib/stores/appStateStore";
</script>

<div class="form-control mb-10">
	<span class="label">
		<span class="label-text">azureOpenAIApiKey</span>
	</span>
	<PasswordInputWrapper bind:value={$appStateStore.azureOpenAIApiKey} />
</div>
