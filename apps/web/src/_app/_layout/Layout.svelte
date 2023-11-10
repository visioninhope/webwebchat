<script>
	// Supports weights 200-800
	import "@fontsource/bricolage-grotesque/index.css";
	import "@fontsource/bricolage-grotesque/200.css";
	import "@fontsource/bricolage-grotesque/300.css";
	import "@fontsource/bricolage-grotesque/400.css";
	import "@fontsource/bricolage-grotesque/500.css";
	import "@fontsource/bricolage-grotesque/600.css";
	import "@fontsource/bricolage-grotesque/700.css";
	import "@fontsource/bricolage-grotesque/800.css";

	import "./app.css";
	import Sidebar from "$lib/components/Sidebar/Sidebar.svelte";
	import Navbar from "$lib/components/Navbar/Navbar.svelte";
	import { location } from "svelte-spa-router";
	import Router from "svelte-spa-router";
	import routes from "./router";

	import Toast from "shared-lib/src/components/toast/Toast.svelte";
	// import { appStateStore } from "$lib/stores/appStateStore";
	import { themeSettingsStore } from "shared-lib/src/stores/themeSettingsStore";

	let checked = false;
	function closeDrawer() {
		checked = false;
	}

	function openSideBar() {
		checked = !checked;
		document
			.querySelector(".app-drawer-container")
			?.classList.toggle("md:drawer-open");
	}
</script>

<div
	class="drawer app-drawer-container md:drawer-open"
	data-theme={$themeSettingsStore.theme}
>
	<input id="my-drawer-3" type="checkbox" class="drawer-toggle" bind:checked />
	<div class="drawer-content min-h-screen flex flex-col">
		<Navbar {openSideBar} />
		<div class="flex-grow px-6 pb-16 xl:pr-2">
			<div
				class="prose prose-sm md:prose-base w-full max-w-4xl flex-grow pt-10 h-full"
			>
				{#key $location}
					<!-- 
						Svelte's little joke to devs: 
						It doesn't rerender different chats/* paths because they're the same component! 
						It's like having twins and calling them by the same name! 
					-->
					<Router {routes} />
				{/key}
			</div>
		</div>
	</div>
	<Sidebar {closeDrawer} />
</div>

<Toast />
