<script lang="ts">
	export let theme: "dark" | "light" | "" = "";
	export let setTheme: (selectedTheme: "dark" | "light" | "") => void;
	let list: ("" | "dark" | "light")[] = ["dark", "light", ""];
</script>

<div>
	{#each list as selectedTheme}
		<button
			type="button"
			class="btn capitalize {selectedTheme === theme ? 'btn-outline' : ''}"
			on:click={() => setTheme(selectedTheme)}
		>
			{#if selectedTheme === "dark"}
				<i class="fa-solid fa-moon" />
			{:else if selectedTheme === "light"}
				<i class="fa-solid fa-sun" />
			{:else}
				<i class="fa-solid fa-desktop" />
			{/if}
			{selectedTheme}
		</button>
	{/each}
</div>
