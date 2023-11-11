<script lang="ts">
	import SettingsTabs from "$root/components/settings/SettingsTabs.svelte";
	import ThemeSettings from "$root/components/settings/ThemeSettings.svelte";
	import { themeSettingsStore } from "$root/stores/themeSettingsStore";
	import OpenAiSettings from "$root/components/settings/OpenAiSettings.svelte";
	import AzureSettings from "$root/components/settings/AzureSettings.svelte";
	import Notes from "$root/components/settings/Notes.svelte";
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
