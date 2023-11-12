<script lang="ts">
	import type { Writable } from "svelte/store";

	export let title: string;
	export let tabs: Writable<string[]>;
	export let active: Writable<string>;

	tabs.update((t: string[]) => [...t, title]);
</script>

{#if $active === title}
	<slot />
{/if}
