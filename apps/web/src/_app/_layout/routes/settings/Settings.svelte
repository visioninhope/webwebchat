<script lang="ts">
	import SettingsTabs from "$lib/components/SettingsTabs.svelte";
	import ThemeSettings from "shared-lib/src/components/settings/theme/ThemeSettings.svelte";
	import { themeSettingsStore } from "shared-lib/src/components/settings/theme/themeSettingsStore";
	import OpenAiSettings from "shared-lib/src/components/settings/openai/OpenAiSettings.svelte";
	import AzureSettings from "shared-lib/src/components/settings/azure/AzureSettings.svelte";
</script>

<SettingsTabs />

<h1>
	<i class="fa-solid fa-gear" />
	Settings
</h1>

<div class="mb-10">
	<ThemeSettings
		theme={$themeSettingsStore.theme}
		setTheme={(selectedTheme) => {
			$themeSettingsStore.theme = selectedTheme;
		}}
	/>
</div>

<div class="alert alert-warning mb-10">
	<i class="fa-solid fa-triangle-exclamation" />
	<div>
		<p>Global setting, you need to enter API key(s) to use this chat app</p>
		<p>
			*All inputs are optional, you can enter what you need and leave the rest
			blank
		</p>
		<p>
			Your API Key is stored locally on your browser and never sent anywhere
			else.
		</p>
	</div>
</div>

<div class="space-y-20">
	<OpenAiSettings />

	<div class="divider" />

	<AzureSettings />
</div>
