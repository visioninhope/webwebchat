<script lang="ts">
	import PasswordInputWrapper from "$root/components/PasswordInputWrapper.svelte";
	import { BASE_NAV } from "$root/constants/BASE_NAV";
	import type { IdbLLMConfigModel } from "$root/idb-models/IdbLLMConfigModel";
	export let idbLLMConfigModel: IdbLLMConfigModel;
</script>

<details>
	<summary
		class="text-primary font-semibold my-2 cursor-pointer hover:underline"
	>
		Override global settings
	</summary>
	<div>
		<div class="text-xs my-2">
			If empty,
			<a href={BASE_NAV.SETTINGS}>global settings</a>
			will be used.
			<br />
			However, if you want to use a different API keys for this model, you can enter
			it here.
		</div>

		<div class="form-control mb-10">
			<span class="label">
				<span class="label-text">azureOpenAIApiKey</span>
			</span>
			<PasswordInputWrapper
				bind:value={idbLLMConfigModel.config.azureOpenAIApiKey}
			/>
		</div>

		<div class="form-control mb-10">
			<span class="label">
				<span class="label-text">azureOpenAIApiVersion</span>
			</span>
			<input
				bind:value={idbLLMConfigModel.config.azureOpenAIApiVersion}
				type="text"
				class="input input-bordered"
			/>
		</div>
		<div class="form-control mb-10">
			<span class="label">
				<span class="label-text">azureOpenAIApiInstanceName</span>
			</span>
			<input
				bind:value={idbLLMConfigModel.config.azureOpenAIApiInstanceName}
				type="text"
				class="input input-bordered"
			/>
		</div>
		<div class="form-control mb-10">
			<span class="label">
				<span class="label-text">azureOpenAIApiDeploymentName</span>
			</span>
			<input
				bind:value={idbLLMConfigModel.config.azureOpenAIApiDeploymentName}
				type="text"
				class="input input-bordered"
			/>
		</div>
	</div>
</details>
