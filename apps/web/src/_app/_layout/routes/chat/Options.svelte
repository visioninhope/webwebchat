<script lang="ts">
	import type { ChatManager } from "$lib/chat/ChatManager";
	import DaisyModal from "shared-lib/src/components/DaisyModal.svelte";
	import LogoType from "$lib/llm/components/logos/LogoType.svelte";
	import LlmList from "./LLMList.svelte";

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
		{chatManager.llmConfig.type}
		{chatManager.llmConfig.name}
		{chatManager.llmConfig.getModelName()}
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
		<LogoType type={chatManager.llmConfig.type} />
		{chatManager.llmConfig.name}
		<p class="text-xs opacity-60">
			<span class="badge badge-outline">
				{chatManager.llmConfig.type}
			</span>
			<span class="badge badge-outline">
				{chatManager.llmConfig.getModelName()}
			</span>
		</p>
		SYSTEM: {chatManager.llmConfig.systemMessage}
	</div>
</div>

<DaisyModal
	bind:this={llmListModal}
	title="Select an LLM to use it for this chat"
>
	<LlmList {chatManager} on:use={useLLM} />
</DaisyModal>
