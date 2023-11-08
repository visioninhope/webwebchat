<script lang="ts">
	import { onMount, createEventDispatcher } from "svelte";
	import type { ChatManager } from "$lib/chat/ChatManager";

	export let chatManager: ChatManager;

	let editedName = "";
	let isEditing = false;
	let showDeleteConfirmation = false;

	const dispatch = createEventDispatcher();

	onMount(() => {
		// Add your logic here
		editedName = chatManager?.chatListTreeviewItem?.name || "";
	});

	function handleSave() {
		isEditing = false;
		chatManager.updateName(editedName);
	}

	function handleCancel() {
		isEditing = false;
		editedName = chatManager.chatListTreeviewItem?.name || "";
	}

	function handleDelete() {
		showDeleteConfirmation = true;
		setTimeout(() => {
			showDeleteConfirmation = false;
		}, 3000);
	}

	function confirmDelete() {
		dispatch("confirmDelete");
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === "Enter") {
			handleSave();
		}
		if (event.key === "Escape") {
			handleCancel();
		}
	}

	function handleEdit() {
		isEditing = true;
		if (editedName.length === 0) {
			editedName = chatManager.chatListTreeviewItem?.name || "";
		}
		// Add focus to the input element
		setTimeout(() => {
			const inputElem = document.querySelector(".input") as HTMLElement;
			if (inputElem) inputElem.focus();
		}, 0);
	}
</script>

<div class="my-6 rounded-lg px-3 py-2 flex max-w-full overflow-hidden border">
	<div class="text-2xl font-bold flex-grow max-w-full overflow-hidden">
		{#if isEditing}
			<input
				type="text"
				placeholder="chat title..."
				class="input w-full input-sm text-base-content"
				bind:value={editedName}
				on:keydown={handleKeyPress}
			/>
		{:else}
			{chatManager?.chatListTreeviewItem?.name || ""}
		{/if}
	</div>
	<div class="mr-10">
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
				class="btn btn-ghost btn-square btn-sm tooltip tooltip-left"
				data-tip="edit chat title"
				on:click={handleEdit}
			>
				<i class="fa-solid fa-pencil" />
			</button>
			{#if showDeleteConfirmation}
				<button
					class="btn btn-outline btn-error btn-sm"
					on:click={confirmDelete}
				>
					Sure?
				</button>
			{:else}
				<button
					class="btn btn-ghost btn-square btn-sm tooltip tooltip-left"
					data-tip="delete this chat"
					on:click={handleDelete}
				>
					<i class="fa-solid fa-trash-can" />
				</button>
			{/if}
		{/if}
	</div>
</div>
