<script lang="ts">
	import { appStateStore } from "$lib/stores/appStateStore";
	import GlobalAzureApiKey from "./GlobalAzureApiKey.svelte";
</script>

<details>
	<summary
		class="text-primary font-semibold my-2 cursor-pointer hover:underline"
	>
		Azure
	</summary>
	<div>
		<GlobalAzureApiKey />

		<div class="form-control mb-10">
			<span class="label">
				<span class="label-text">azureOpenAIApiVersion</span>
			</span>
			<input
				bind:value={$appStateStore.azureOpenAIApiVersion}
				type="text"
				class="input input-bordered"
			/>
		</div>
		<div class="form-control mb-10">
			<span class="label">
				<span class="label-text">azureOpenAIApiInstanceName</span>
			</span>
			<input
				bind:value={$appStateStore.azureOpenAIApiInstanceName}
				type="text"
				class="input input-bordered"
			/>
		</div>
		<div class="form-control mb-10">
			<span class="label">
				<span class="label-text">azureOpenAIApiDeploymentName</span>
			</span>
			<input
				bind:value={$appStateStore.azureOpenAIApiDeploymentName}
				type="text"
				class="input input-bordered"
			/>
		</div>
	</div>
</details>
