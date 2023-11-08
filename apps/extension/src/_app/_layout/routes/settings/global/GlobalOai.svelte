<script lang="ts">
	import PasswordInputWrapper from "ui/components/PasswordInputWrapper.svelte";
	import { appStateStore } from "$lib/stores/appStateStore";
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
	<PasswordInputWrapper bind:value={$appStateStore.openAIApiKey} />
</div>
