<script lang="ts">
	import { writable } from "svelte/store";
	export let defaultTab: string;
	const tabs = writable([]);
	const active = writable(defaultTab);
	export let tabsContainerClass = "tabs mb-10";
	export let btnClass = "tab tab-bordered";
	export let activeBtnClass = "tab-active";
</script>

<div class={tabsContainerClass}>
	{#each $tabs as tab (tab)}
		<button
			on:click={() => ($active = tab)}
			class="{btnClass} {$active === tab ? activeBtnClass : ''}"
		>
			{tab}
		</button>
	{/each}
</div>

<slot {tabs} {active} />

<!-- 
    SAMPLE USAGE:
<Tabs
    let:tabs
    let:active
    defaultTab="Tab 1"
    activeBtnClass="tab-active"
    btnClass="tab tab-lg tab-lifted"
    tabsContainerClass="tabs mb-10 tabs-boxed"
>
    <Tab {tabs} {active} title="Tab 1">Content for Tab 1</Tab>
    <Tab {tabs} {active} title="Tab 2">tab2</Tab>
    <Tab {tabs} {active} title="Tab 3">Content for Tab 3</Tab>
</Tabs>
-->
