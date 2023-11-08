<script lang="ts">
	import ChatItem from "./ChatItem.svelte";
	import FolderItem from "./FolderItem.svelte";
	import {
		chatListTreeviewStore,
		findItem,
	} from "$lib/stores/chatListTreeviewStore";

	function handleDragOver(event: DragEvent | TouchEvent) {
		event.preventDefault();
		// event.stopPropagation();
	}

	function handleDrop(event: DragEvent | TouchEvent) {
		event.preventDefault();
		event.stopPropagation();
		const draggedCurrentItemId = chatListTreeviewStore.draggedItemId;
		chatListTreeviewStore.draggedItemId = null;
		if (draggedCurrentItemId !== null) {
			let sourceItem = findItem(
				$chatListTreeviewStore.treeviewItems,
				draggedCurrentItemId
			);
			if (sourceItem && sourceItem.parent && sourceItem.parent.children) {
				sourceItem.parent.children.splice(sourceItem.index, 1);
				$chatListTreeviewStore.treeviewItems.splice(
					$chatListTreeviewStore.length,
					0,
					sourceItem.item
				);
				chatListTreeviewStore.reRenderer();
				// chatListTreeviewStore.set($chatListTreeviewStore);
			}
		}
	}
</script>

<div
	class="flex-grow w-full"
	on:dragover={handleDragOver}
	on:drop={handleDrop}
	on:touchmove={handleDragOver}
	on:touchend={handleDrop}
	role="tree"
	tabindex="0"
>
	<div class="h-full">
		{#each $chatListTreeviewStore.treeviewItems as item (item.id)}
			{#if item.type === "folder"}
				<FolderItem {item} />
			{:else}
				<ChatItem {item} />
			{/if}
		{/each}
	</div>
</div>
