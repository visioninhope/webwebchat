<script lang="ts">
	import type { ChatManager } from "$lib/chat/ChatManager";
	import DaisyModal from "ui/components/DaisyModal.svelte";
	import {
		IdbLLMConfig,
		NEW_LLM_CONFIG_ID,
	} from "$lib/idb-models/IdbLLMConfig";
	import LlmConfigEdit from "$lib/llm/components/LLMConfigEdit.svelte";
	import LogoType from "$lib/llm/components/logos/LogoType.svelte";
	import { llmConfigList } from "$lib/stores/LLMConfigList";
	import { appStateStore } from "$lib/stores/appStateStore";
	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();

	export let chatManager: ChatManager;
	let configEditModal: DaisyModal;
	let idbLLMConfig: IdbLLMConfig;

	async function showEditConfigModal(llmConfigId: string) {
		if (!idbLLMConfig || idbLLMConfig.llmConfigId !== llmConfigId) {
			idbLLMConfig = await IdbLLMConfig.withLoad(llmConfigId);
		}
		configEditModal.showModal();
	}

	async function useLLM(llmConfigId: string) {
		chatManager.chatOptions.llmConfigId = llmConfigId;
		chatManager.chatOptions.save();
		dispatch("use");
	}

	async function saveModel(event: CustomEvent) {
		if (event.detail.makeDefaultModel) {
			appStateStore.defaultLLMConfigId = await idbLLMConfig.save();
			chatManager.chatOptions.llmConfigId = appStateStore.defaultLLMConfigId;
			chatManager.chatOptions.save();
			configEditModal.close();
		} else {
			await idbLLMConfig.save();
			configEditModal.close();
		}
		dispatch("use");
	}
</script>

<h1>
	<i class="fa-solid fa-robot" />
	LLMs
</h1>
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
	{#each $llmConfigList.list as model, index (model.llmConfigId)}
		<div
			class="border card shadow-md
                {chatManager.chatOptions.llmConfigId === model.llmConfigId
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
					<span class="badge badge-outline">{model.type}</span>
					<span class="badge badge-outline">{model.model}</span>
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
						disabled={chatManager.chatOptions.llmConfigId === model.llmConfigId}
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
	on:click={() => showEditConfigModal(NEW_LLM_CONFIG_ID)}
>
	<i class="fa-solid fa-plus" />
	New
</button>

<DaisyModal bind:this={configEditModal} title="LLM config">
	<LlmConfigEdit bind:idbLLMConfig on:save={saveModel} />
</DaisyModal>
