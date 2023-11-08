<script lang="ts">
	import { appStateStore } from "$lib/stores/appStateStore";
	function setTheme(themeOption: string) {
		appStateStore.theme = themeOption as "dark" | "light" | "auto";
	}
</script>

<div>
	{#each ["dark", "light", "auto"] as themeOption (themeOption)}
		<button
			type="button"
			class="btn capitalize {themeOption === $appStateStore.theme
				? 'btn-outline'
				: ''}"
			on:click={() => setTheme(themeOption)}
		>
			{#if themeOption === "dark"}
				<i class="fa-solid fa-moon" />
			{:else if themeOption === "light"}
				<i class="fa-solid fa-sun" />
			{:else}
				<i class="fa-solid fa-desktop" />
			{/if}
			{themeOption}
		</button>
	{/each}
</div>
