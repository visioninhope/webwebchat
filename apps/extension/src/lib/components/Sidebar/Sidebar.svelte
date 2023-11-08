<script lang="ts">
	// import { goto } from "$app/navigation";
	import { push as goto } from "svelte-spa-router";
	import { BASE_NAV } from "$lib/constants/BASE_NAV";
	import SortableList from "./SortableList/SortableList.svelte";
	import { addChat, addFolder } from "$lib/stores/chatListTreeviewStore";
	import SidebarSearch from "./SidebarSearch.svelte";

	export let closeDrawer = () => {};
</script>

<div class="drawer-side z-40">
	<label for="my-drawer-3" class="drawer-overlay" />
	<div class="menu w-80 p-0 min-h-full bg-base-300 text-base-content">
		<div class="sticky w-full bg-base-300 top-0 px-2 space-y-2 py-2 z-30">
			<div class="flex items-center justify-center space-x-2">
				<a
					href={BASE_NAV.SETTINGS}
					on:click={closeDrawer}
					class="btn btn-square btn-sm btn-outline tooltip tooltip-right"
					data-tip="Settings"
				>
					<i class="fa-solid fa-gear" />
				</a>
				<button
					class="btn flex-grow btn-primary"
					on:click={() => {
						goto(BASE_NAV.CHAT(addChat()));
						closeDrawer();
					}}
				>
					<i class="fa-regular fa-comment-dots" />
					New Chat
				</button>
				<button
					on:click={closeDrawer}
					class="btn btn-square btn-sm btn-outline md:hidden"
				>
					<i class="fa-solid fa-circle-xmark" />
				</button>
				<!-- <button
					class="btn btn-square btn-sm btn-outline tooltip tooltip-left"
					data-tip="new folder"
					on:click={() => {
						addFolder("New Folder");
					}}
				>
					<i class="fa-solid fa-folder-plus" />
				</button> -->
			</div>
			<SidebarSearch />
		</div>
		<SortableList />
	</div>
</div>
