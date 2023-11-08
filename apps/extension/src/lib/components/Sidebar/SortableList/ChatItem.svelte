<script lang="ts">
	import {
		chatListTreeviewStore,
		findItem,
	} from "$lib/stores/chatListTreeviewStore";
	import type { Item } from "$lib/stores/chatListTreeviewStore";
	// import { goto } from "$app/navigation";
	// import { page } from "$app/stores";
	import { push as goto, params } from "svelte-spa-router";
	import { BASE_NAV } from "$lib/constants/BASE_NAV";
	import { ChatManager } from "$lib/chat/ChatManager";

	export let item: Item;

	let showDeleteConfirmation = false;

	function handleDragStart(event: DragEvent | TouchEvent) {
		event.stopPropagation();
		chatListTreeviewStore.draggedItemId = item.id;
	}

	function handleDragOver(event: DragEvent | TouchEvent) {
		event.preventDefault();
	}

	function handleDrop(event: DragEvent | TouchEvent) {
		event.preventDefault();
		event.stopPropagation();
		const draggedCurrentItemId = chatListTreeviewStore.draggedItemId;
		chatListTreeviewStore.draggedItemId = null;
		let droppedOverElem = event.target as HTMLElement;
		let targetId = droppedOverElem.getAttribute("data-drag-id");
		while (targetId === null) {
			droppedOverElem = droppedOverElem.parentNode as HTMLElement;
			targetId = droppedOverElem.getAttribute("data-drag-id");
		}
		if (draggedCurrentItemId === targetId || !draggedCurrentItemId || !targetId)
			return;
		let sourceItem = findItem(
			$chatListTreeviewStore.treeviewItems,
			draggedCurrentItemId
		);
		let targetItem = findItem($chatListTreeviewStore.treeviewItems, targetId);
		if (sourceItem && targetItem) {
			if (
				sourceItem.item.type === "folder" &&
				targetItem.item.type === "chat" &&
				"type" in targetItem.parent &&
				targetItem.parent.type === "folder"
			) {
				return;
			}
			// Remove the source item from its parent's children
			if (sourceItem.parent && sourceItem.parent.children) {
				sourceItem.parent.children.splice(sourceItem.index, 1);
			}
			// Determine drop position (before or after)
			let rect = droppedOverElem.getBoundingClientRect();
			let dropPosition =
				("clientY" in event
					? event.clientY
					: event.touches[0].clientY - rect.top) /
					rect.height >
				0.5
					? "after"
					: "before";
			// Add the source item to the target's parent's children at the correct position
			if (targetItem.parent && targetItem.parent.children) {
				let insertIndex =
					dropPosition === "after" ? targetItem.index + 1 : targetItem.index;
				targetItem.parent.children.splice(insertIndex, 0, sourceItem.item);
				chatListTreeviewStore.reRenderer();
			}
		}
	}

	function handleDelete() {
		showDeleteConfirmation = true;
		setTimeout(() => {
			showDeleteConfirmation = false;
		}, 3000);
	}

	async function confirmDelete() {
		await ChatManager.delete(item.id);
		goto(BASE_NAV.HOME);
	}
</script>

{#if $chatListTreeviewStore.searchString === "" || item.isVisible}
	<div
		class="border border-x-0 border-t-0 {$params?.chatId === item.id
			? 'bg-primary text-primary-content'
			: 'bg-base-100 text-base-content'}"
		data-drag-id={item.id}
		draggable="true"
		on:dragstart={handleDragStart}
		on:dragover={handleDragOver}
		on:drop={handleDrop}
		on:touchstart={handleDragStart}
		on:touchmove={handleDragOver}
		on:touchend={handleDrop}
		role="listitem"
	>
		<div class={$chatListTreeviewStore.draggedItemId === item.id ? "" : "flex"}>
			<button
				class="p-2 flex items-center space-x-2 flex-grow overflow-hidden"
				on:click={() => {
					goto(BASE_NAV.CHAT(item.id));
				}}
			>
				<i class="fa-regular fa-comment-dots" />
				<span class="truncate">{item.name}</span>
			</button>
			<div
				class="flex items-center space-x-2 {$chatListTreeviewStore.draggedItemId ===
				item.id
					? 'hidden'
					: ''}"
			>
				{#if showDeleteConfirmation}
					<button
						class="btn btn-outline btn-error btn-sm"
						on:click={confirmDelete}
					>
						Sure?
					</button>
				{:else}
					<button
						class="btn btn-ghost btn-square btn-sm opacity-50 tooltip tooltip-left"
						data-tip="delete"
						on:click={handleDelete}
					>
						<i class="fa-solid fa-trash-can" />
					</button>
				{/if}
			</div>
		</div>
	</div>
{/if}
