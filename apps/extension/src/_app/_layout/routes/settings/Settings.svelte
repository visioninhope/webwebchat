<script lang="ts">
	import SettingsTabs from "$lib/components/SettingsTabs.svelte";
	import GlobalAnthropic from "./global/GlobalAnthropic.svelte";
	import GlobalAzure from "./global/GlobalAzure.svelte";
	import GlobalOai from "./global/GlobalOai.svelte";
	import ThemeSelect from "ui/components/settings/ThemeSelect.svelte";
	import { themeStore } from "utils-vite-svelte/lib/shared-stores/themeStore";
</script>

<SettingsTabs />

<h1>
	<i class="fa-solid fa-gear" />
	Settings
</h1>

<div class="mb-10">
	<ThemeSelect
		theme={$themeStore.theme}
		setTheme={(selectedTheme) => {
			$themeStore.theme = selectedTheme;
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
	<GlobalOai />
	<div class="divider" />

	<GlobalAnthropic />
	<div class="divider" />

	<GlobalAzure />
</div>
