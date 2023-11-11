<script lang="ts">
	import SettingsTabs from "shared-lib/src/components/settings/SettingsTabs.svelte";
	import ThemeSettings from "shared-lib/src/components/settings/ThemeSettings.svelte";
	import { themeSettingsStore } from "shared-lib/src/stores/themeSettingsStore";
	import OpenAiSettings from "shared-lib/src/components/settings/OpenAiSettings.svelte";
	import AzureSettings from "shared-lib/src/components/settings/AzureSettings.svelte";
	import Notes from "shared-lib/src/components/settings/Notes.svelte";
</script>

<SettingsTabs />

<h1>
	<i class="fa-solid fa-gear" />
	Settings
</h1>

<ThemeSettings
	theme={$themeSettingsStore.theme}
	setTheme={(selectedTheme) => {
		$themeSettingsStore.theme = selectedTheme;
	}}
/>

<Notes />

<div class="space-y-20">
	<OpenAiSettings />

	<div class="divider" />

	<details>
		<summary
			class="text-primary font-semibold my-2 cursor-pointer hover:underline"
		>
			Azure
		</summary>
		<AzureSettings />
	</details>
</div>
