<script lang="ts">
	import SettingsLLMList from "$root/components/llm/SettingsLLMList.svelte";
	// import Webstore from "$root/components/utils/Webstore.svelte";
	// import Tab from "$root/components/utils/tabs/Tab.svelte";
	// import Tabs from "$root/components/utils/tabs/Tabs.svelte";
</script>

<!-- 
<Tabs
	let:tabs
	let:active
	defaultTab="Tab 1"
	btnClass="tab tab-lg tab-lifted"
	tabsContainerClass="tabs mb-10 tabs-boxed"
>
	<Tab {tabs} {active} title="Tab 1">
		Content for Tab 1
		<Webstore />
	</Tab>
	<Tab {tabs} {active} title="Tab 2">tab2</Tab>
	<Tab {tabs} {active} title="Tab 3">Content for Tab 3</Tab>
</Tabs> -->

<SettingsLLMList />
