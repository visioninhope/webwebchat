<script lang="ts">
	import PasswordInputWrapper from "../../PasswordInputWrapper.svelte";
	import { openAiApiKeyStore } from "./openAiApiKeyStore";
</script>

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
	<PasswordInputWrapper bind:value={$openAiApiKeyStore.openAIApiKey} />
</div>
