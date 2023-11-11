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
	<div class="form-control mb-10">
		<span class="label">
			<span class="label-text">OpenAI API Key</span>
			<a
				class="link"
				target="_blank"
				href="https://platform.openai.com/account/api-keys"
			>
				(Get API key here)
			</a>
		</span>
		<div class="text-xs my-1">
			If empty, the <u>OpenAI API KEY</u>
			in the
			<a href={BASE_NAV.SETTINGS}>global settings</a>
			will be used.
			<br />
			However, if you want to use a different API key for this model, you can enter
			it here.
		</div>
		<PasswordInputWrapper bind:value={idbLLMConfigModel.config.openAIApiKey} />
	</div>
</details>
