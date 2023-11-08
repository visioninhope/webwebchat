<script lang="ts">
	import {
		addFolder,
		chatListTreeviewStore,
		generateSearchIndex,
	} from "$lib/stores/chatListTreeviewStore";
</script>

<div class="relative flex items-center space-x-2">
	<div
		class="flex-grow relative tooltip tooltip-top tooltip-secondary"
		data-tip="* AND OR NOT operators, also regex🥲🔫"
	>
		<input
			type="text"
			placeholder="Search..."
			class="input input-bordered w-full"
			bind:value={$chatListTreeviewStore.searchString}
			on:focus={generateSearchIndex}
		/>
		{#if $chatListTreeviewStore.searchString !== ""}
			<button
				class="btn btn-square absolute right-0 top-0"
				on:click={() => (chatListTreeviewStore.searchString = "")}
			>
				<i class="fa-solid text-2xl fa-circle-xmark" />
			</button>
		{/if}
	</div>
	<div
		class="flex items-center space-x-2 {$chatListTreeviewStore.searchString !==
		''
			? 'hidden'
			: ''}"
	>
		<button
			class="btn btn-square btn-sm btn-outline tooltip tooltip-left"
			data-tip="new folder"
			on:click={() => {
				addFolder("New Folder");
			}}
		>
			<i class="fa-solid fa-folder-plus" />
		</button>
		<!-- <button class="btn btn-ghost btn-square btn-sm">
            <i class="fa-solid fa-angle-down" />
        </button> -->
	</div>
</div>
