<script lang="ts">
	import type { ChatManager } from "$root/managers/ChatManager";
	import DaisyModal from "$root/components/utils/DaisyModal.svelte";
	import { IdbLLMConfigModel } from "$root/idb-models/IdbLLMConfigModel";
	import { NEW_IDB_KEY } from "$root/constants/constants";
	import LLMConfigEdit from "$root/components/llm/LLMConfigEdit.svelte";
	import LogoType from "$root/components/logos/LogoType.svelte";
	import { llmConfigListStore } from "$root/stores/llmConfigListStore";
	import { createEventDispatcher } from "svelte";
	import { chatSettingsStore } from "$root/stores/chatSettingsStore";

	const dispatch = createEventDispatcher();
	export let chatManager: ChatManager;
	let modalElement: DaisyModal;
	let idbLLMConfigModel: IdbLLMConfigModel;

	async function showEditConfigModal(llmConfigId: string) {
		if (!idbLLMConfigModel || idbLLMConfigModel.llmConfigId !== llmConfigId) {
			idbLLMConfigModel = await IdbLLMConfigModel.withLoad(llmConfigId);
		}
		modalElement.showModal();
	}

	async function useLLM(llmConfigId: string) {
		chatManager.idbChatOptionsModel.llmConfigId = llmConfigId;
		chatManager.idbChatOptionsModel.save();
		dispatch("use");
	}

	async function saveModel(event: CustomEvent) {
		if (event.detail.makeDefaultModel) {
			chatSettingsStore.defaultLLMConfigId = await idbLLMConfigModel.save();
			chatManager.idbChatOptionsModel.llmConfigId =
				chatSettingsStore.defaultLLMConfigId;
			chatManager.idbChatOptionsModel.save();
			modalElement.close();
		} else {
			await idbLLMConfigModel.save();
			modalElement.close();
		}
		dispatch("use");
	}
</script>

<h1>
	<i class="fa-solid fa-robot" />
	LLMs
</h1>
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
	{#each $llmConfigListStore.list as model, index (model.llmConfigId)}
		<div
			class="border card shadow-md
                {chatManager.idbChatOptionsModel.llmConfigId ===
			model.llmConfigId
				? 'border-primary'
				: ''}
                "
		>
			<div class="card-body">
				<h2 class="card-title">
					<LogoType type={model.type} />
					{model.name}
				</h2>
				<p class="text-xs">
					<span class="border p-2">{model.type}</span>
					<span class="border p-2">{model.model}</span>
				</p>
				<div class="card-actions justify-end">
					<button
						class="btn btn-primary tooltip"
						data-tip="Edit this LLM config"
						on:click={() => showEditConfigModal(model.llmConfigId)}
					>
						Edit
					</button>
					<button
						class="btn btn-outline tooltip text-xs"
						data-tip="use for current chat"
						disabled={chatManager.idbChatOptionsModel.llmConfigId ===
							model.llmConfigId}
						on:click={() => useLLM(model.llmConfigId)}
					>
						Use
					</button>
				</div>
			</div>
		</div>
	{/each}
</div>

<button
	class="btn btn-primary text-sm my-6 tooltip tooltip-right"
	data-tip="Create a new LLM config"
	on:click={() => showEditConfigModal(NEW_IDB_KEY)}
>
	<i class="fa-solid fa-plus" />
	New
</button>

<DaisyModal bind:this={modalElement} title="LLM config">
	<!-- <LLMConfigEdit bind:idbLLMConfigModel on:save={saveModel} /> -->
</DaisyModal>
