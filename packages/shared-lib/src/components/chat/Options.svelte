<script lang="ts">
	import type { ChatManager } from "$root/managers/ChatManager";
	import DaisyModal from "$root/components/utils/DaisyModal.svelte";
	import LogoType from "$root/components/logos/LogoType.svelte";
	import ChatLLMList from "./ChatLLMList.svelte";

	export let chatManager: ChatManager;
	let llmListModal: DaisyModal;

	function showModal() {
		llmListModal.showModal();
	}

	async function useLLM() {
		llmListModal.close();
		await chatManager.reloadLLMConfig();
		// svelte does not update the DOM if we don't do this
		chatManager = chatManager;
	}
</script>

<div
	class="fixed bottom-0 right-0 max-w-full max-h-6 flex overflow-x-auto scrollbar-hide z-10"
>
	<button class="btn btn-xs" on:click={showModal} title="Model settings">
		{chatManager.idbLLMConfigModel.type}
		{chatManager.idbLLMConfigModel.name}
		{chatManager.idbLLMConfigModel.getModelName()}
		<i class="fa-solid fa-cog text-xs" />
	</button>
</div>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="my-6 rounded-lg px-3 py-2 flex border cursor-pointer tooltip tooltip-bottom"
	data-tip="Update Model options"
	on:click={showModal}
>
	<div class="mr-2">
		<span class="btn btn-ghost btn-square btn-sm">
			<i class="fa-solid fa-cog" />
		</span>
	</div>
	<div class="max-w-full chat-message-container text-left">
		<LogoType type={chatManager.idbLLMConfigModel.type} />
		{chatManager.idbLLMConfigModel.name}
		<p class="text-xs opacity-60">
			<span class="border p-2">
				{chatManager.idbLLMConfigModel.type}
			</span>
			<span class="border p-2">
				{chatManager.idbLLMConfigModel.getModelName()}
			</span>
		</p>
		SYSTEM: {chatManager.idbLLMConfigModel.systemMessage}
	</div>
</div>

<DaisyModal
	bind:this={llmListModal}
	title="Select an LLM to use it for this chat"
>
	<ChatLLMList {chatManager} on:use={useLLM} />
</DaisyModal>
