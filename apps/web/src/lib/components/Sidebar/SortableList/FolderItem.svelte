<script lang="ts">
	import ChatItem from "./ChatItem.svelte";
	import {
		chatListTreeviewStore,
		removeFolder,
		type Item,
		updateTreeItem,
		findItem,
	} from "$lib/stores/chatListTreeviewStore";
	// import { push as goto, params } from "svelte-spa-router";
	// import { goto } from "$app/navigation";
	// import { page } from "$app/stores";
	import { push as goto, params } from "svelte-spa-router";
	import { BASE_NAV } from "config-helpers/BASE_NAV";

	export let item: Item;

	let isEditing = false;
	let editedName = item.name;
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
			let rect = droppedOverElem.getBoundingClientRect();
			let dropPosition =
				(("clientY" in event
					? event.clientY
					: event.touches[0].clientY - rect.top) -
					rect.top) /
					rect.height >
				0.5
					? "after"
					: "before";
			// Add the source item to the target's parent's children at the correct position
			let insertIndex =
				dropPosition === "after" ? targetItem.index + 1 : targetItem.index;
			if (
				sourceItem.item.type === "folder" &&
				targetItem.item.type === "folder"
			) {
				$chatListTreeviewStore.treeviewItems.splice(sourceItem.index, 1);
				$chatListTreeviewStore.treeviewItems.splice(
					insertIndex,
					0,
					sourceItem.item
				);
				chatListTreeviewStore.reRenderer();
				// chatListTreeviewStore.set($chatListTreeviewStore);
			} else {
				// Remove the source item from its parent's children
				if (sourceItem.parent && sourceItem.parent.children) {
					sourceItem.parent.children.splice(sourceItem.index, 1);
				}
				// Determine drop position (before or after)

				if (targetItem.item.type === "folder" && targetItem.item.children) {
					targetItem.item.children.splice(insertIndex, 0, sourceItem.item);
				} else {
					if (targetItem.parent && targetItem.parent.children) {
						targetItem.parent.children.splice(insertIndex, 0, sourceItem.item);
					}
				}

				chatListTreeviewStore.set($chatListTreeviewStore);
			}
		}
	}
	function toggleOpen() {
		if (isEditing) {
			return;
		}
		updateTreeItem(item.id, { isOpen: !item.isOpen });
	}

	function handleEdit() {
		isEditing = true;
	}

	function handleSave() {
		isEditing = false;
		updateTreeItem(item.id, { name: editedName });
	}

	function handleCancel() {
		isEditing = false;
		editedName = item.name;
	}

	function handleDelete() {
		showDeleteConfirmation = true;
		setTimeout(() => {
			showDeleteConfirmation = false;
		}, 3000);
	}

	function confirmDelete() {
		if (
			(item.children?.length ?? 0) > 0 &&
			confirm(
				`🛑🛑🛑🛑🛑\nAll chats inside this folder will be permanently deleted.\nAre you sure you want to delete this folder?`
			)
		) {
			removeFolder(item.id);
			goto(BASE_NAV.HOME);
		} else if (item.children?.length === 0) {
			removeFolder(item.id);
			goto(BASE_NAV.HOME);
		}
	}
	let checkChatIdInChildren = false;
	$: {
		checkChatIdInChildren =
			item.children?.map((child) => child.id).includes($params?.chatId || "") ||
			false;
	}
</script>

{#if $chatListTreeviewStore.searchString === "" || item.isVisible}
	<div
		class="bg-base-200 border border-x-0 border-t-0"
		draggable="true"
		data-drag-id={item.id}
		on:dragstart={handleDragStart}
		on:dragover={handleDragOver}
		on:drop={handleDrop}
		on:touchstart={handleDragStart}
		on:touchmove={handleDragOver}
		on:touchend={handleDrop}
		role="listitem"
	>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="{$chatListTreeviewStore.draggedItemId === item.id
				? ''
				: 'flex'} bg-base-200 {!item.isOpen && checkChatIdInChildren
				? 'bg-primary text-primary-content'
				: ''}"
		>
			<div
				class="flex items-center space-x-2 cursor-pointer flex-grow overflow-hidden"
				on:click={toggleOpen}
			>
				<span class="p-2 rounded-md w-full">
					<div class="flex items-center space-x-2">
						{#if isEditing}
							<input
								class="input input-bordered input-xs w-full max-w-xs"
								bind:value={editedName}
							/>
						{:else}
							<span>
								{#if item.isOpen}
									<i class="fa-solid fa-caret-down" />
								{:else}
									<i class="fa-solid fa-caret-right" />
								{/if}
							</span>
							<span class="truncate">{item.name}</span>
						{/if}
					</div>
				</span>
			</div>
			<div
				class="flex items-center space-x-2 {$chatListTreeviewStore.draggedItemId ===
				item.id
					? 'hidden'
					: ''}"
			>
				<!-- <button
				class="btn btn-ghost btn-square btn-sm tooltip tooltip-left"
				data-tip="add new chat in folder"
				on:click={() => {
					goto(
						BASE_NAV.CHAT(
							addChat() 
						)
					);
				}}
			>
				<i class="fa-solid fa-plus" />
			</button> -->
				{#if isEditing}
					<button
						class="btn btn-ghost btn-square btn-sm tooltip tooltip-left"
						data-tip="save"
						on:click={handleSave}
					>
						<i class="fa-solid fa-check" />
					</button>
					<button
						class="btn btn-ghost btn-square btn-sm tooltip tooltip-left"
						data-tip="cancel"
						on:click={handleCancel}
					>
						<i class="fa-solid fa-times" />
					</button>
				{:else}
					<button
						class="btn btn-ghost btn-square btn-sm opacity-50 tooltip tooltip-left"
						data-tip="edit name"
						on:click={handleEdit}
					>
						<i class="fa-solid fa-pencil" />
					</button>
					{#if showDeleteConfirmation}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-missing-attribute -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<a class="text-red-500 cursor-pointer" on:click={confirmDelete}>
							Sure?
						</a>
					{:else}
						<button
							class="btn btn-ghost btn-square btn-sm opacity-50 tooltip tooltip-left"
							data-tip="delete"
							on:click={handleDelete}
						>
							<i class="fa-solid fa-trash-can" />
						</button>
					{/if}
				{/if}
			</div>
		</div>
		{#if item.isOpen && item.children && item.children.length > 0}
			<div class="ml-6">
				{#each item.children as child (child.id)}
					<ChatItem item={child} />
				{/each}
			</div>
		{:else if item.isOpen}
			<span class="ml-4">Empty folder</span>
		{/if}
	</div>
{/if}
