<script lang="ts">
	import PasswordInputWrapper from "$root/components/utils/PasswordInputWrapper.svelte";
	import { azureSettingsStore } from "$root/stores/azureSettingsStore";
</script>

<div>
	<div class="form-control mb-10">
		<span class="label">
			<span class="label-text">azureOpenAIApiKey</span>
		</span>
		<PasswordInputWrapper bind:value={$azureSettingsStore.azureOpenAIApiKey} />
	</div>

	<div class="form-control mb-10">
		<span class="label">
			<span class="label-text">azureOpenAIApiVersion</span>
		</span>
		<input
			bind:value={$azureSettingsStore.azureOpenAIApiVersion}
			type="text"
			class="input input-bordered"
		/>
	</div>
	<div class="form-control mb-10">
		<span class="label">
			<span class="label-text">azureOpenAIApiInstanceName</span>
		</span>
		<input
			bind:value={$azureSettingsStore.azureOpenAIApiInstanceName}
			type="text"
			class="input input-bordered"
		/>
	</div>
	<div class="form-control mb-10">
		<span class="label">
			<span class="label-text">azureOpenAIApiDeploymentName</span>
		</span>
		<input
			bind:value={$azureSettingsStore.azureOpenAIApiDeploymentName}
			type="text"
			class="input input-bordered"
		/>
	</div>
</div>
