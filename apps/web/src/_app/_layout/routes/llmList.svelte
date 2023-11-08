<script lang="ts">
	import { llmConfigList } from "$lib/stores/LLMConfigList";
	import { appStateStore } from "$lib/stores/appStateStore";
	import SettingsTabs from "$lib/components/SettingsTabs.svelte";
	import LogoType from "$lib/llm/components/logos/LogoType.svelte";
	import DaisyModal from "ui/components/DaisyModal.svelte";
	import LlmConfigEdit from "$lib/llm/components/LLMConfigEdit.svelte";
	import {
		IdbLLMConfig,
		NEW_LLM_CONFIG_ID,
	} from "$lib/idb-models/IdbLLMConfig";
	let modalElement: DaisyModal;
	let idbLLMConfig: IdbLLMConfig;

	async function showModal(llmConfigId: string) {
		if (!idbLLMConfig || idbLLMConfig.llmConfigId !== llmConfigId) {
			idbLLMConfig = await IdbLLMConfig.withLoad(llmConfigId);
		}
		modalElement.showModal();
	}
	async function remove(llmConfigId: string) {
		if (confirm("Are you sure you want to delete this chat model?")) {
			await IdbLLMConfig.delete(llmConfigId);
			modalElement.close();
		}
	}
	async function saveModel(event: CustomEvent) {
		if (event.detail.makeDefaultModel) {
			appStateStore.defaultLLMConfigId = await idbLLMConfig.save();
			modalElement.close();
		} else {
			await idbLLMConfig.save();
			modalElement.close();
		}
	}
</script>

<SettingsTabs />

<h1>
	<i class="fa-solid fa-robot" />
	LLMs
</h1>
<div
	class="not-prose grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3"
>
	{#each $llmConfigList.list as model, index (model.llmConfigId)}
		<div
			class="border hover:bg-base-200 transition-all duration-200 hover:-translate-y-1 {$appStateStore.defaultLLMConfigId ===
			model.llmConfigId
				? 'border-primary'
				: ''}"
		>
			<div class="card-body">
				<h2 class="card-title">
					<figure class="">
						<LogoType type={model.type} />
					</figure>
					{model.name}
				</h2>
				<p class="text-xs opacity-60">
					<span class="badge badge-outline">{model.type}</span>
					<span class="badge badge-outline">{model.model}</span>
				</p>
				<div class="card-actions justify-end">
					<!-- href={BASE_NAV.LLM_MODEL(model.llmConfigId)} -->
					<button
						class="btn btn-primary"
						on:click={() => showModal(model.llmConfigId)}
					>
						Edit
					</button>
					<button
						class="btn btn-outline tooltip text-xs"
						data-tip="Use for all future chats"
						disabled={$appStateStore.defaultLLMConfigId === model.llmConfigId}
						on:click={() =>
							(appStateStore.defaultLLMConfigId = model.llmConfigId)}
					>
						{$appStateStore.defaultLLMConfigId === model.llmConfigId
							? "✅"
							: ""}
						Make default
					</button>
					{#if $appStateStore.defaultLLMConfigId !== model.llmConfigId}
						<button
							class="btn btn-outline btn-error tooltip text-xs"
							data-tip="remove this LLM config"
							on:click={() => {
								remove(model.llmConfigId);
							}}
						>
							Delete
						</button>
					{/if}
				</div>
			</div>
		</div>
	{/each}
</div>

<!-- href={BASE_NAV.LLM_MODEL(NEW_LLM_CONFIG_ID)} -->
<button
	class="btn btn-primary text-sm my-6"
	on:click={() => showModal(NEW_LLM_CONFIG_ID)}
>
	<i class="fa-solid fa-plus" />
	New
</button>

<DaisyModal bind:this={modalElement} title="LLM config">
	<LlmConfigEdit bind:idbLLMConfig on:save={saveModel} />
</DaisyModal>
