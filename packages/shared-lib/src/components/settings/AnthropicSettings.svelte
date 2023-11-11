<script lang="ts">
	import PasswordInputWrapper from "$root/components/utils/PasswordInputWrapper.svelte";
	import { anthropicSettingsStore } from "$root/stores/anthropicSettingsStore";
</script>

<div class="form-control mb-10">
	<span class="label">
		<span class="label-text">Anthropic API Key</span>
		<a
			class="link"
			target="_blank"
			href="https://console.anthropic.com/account/keys"
		>
			(Get API key here)
		</a>
	</span>
	<PasswordInputWrapper bind:value={$anthropicSettingsStore.anthropicApiKey} />
</div>
