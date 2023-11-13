<script lang="ts">
	import { llmConfigListStore } from "$root/stores/llmConfigListStore";
	import SettingsTabs from "$root/components/settings/SettingsTabs.svelte";
	import LogoType from "$root/components/logos/LogoType.svelte";
	import DaisyModal from "$root/components/utils/DaisyModal.svelte";
	import LLMConfigEdit from "$root/components/llm/LLMConfigEdit.svelte";
	import { IdbLLMConfigModel } from "$root/idb-models/IdbLLMConfigModel";
	import { NEW_IDB_KEY } from "$root/constants/constants";
	import { chatSettingsStore } from "$root/stores/chatSettingsStore";
	import type { LLMTypeEnum } from "$root/types/LLMTypeEnum";
	import type { SvelteComponent } from "svelte";
	let modalElement: DaisyModal;
	let idbLLMConfigModel: IdbLLMConfigModel;

	export let getConfigContainerComponent: (
		type: LLMTypeEnum
	) => typeof SvelteComponent | undefined;

	let llmConfigEditComponent: LLMConfigEdit;
	async function showModal(llmConfigId: string) {
		if (!idbLLMConfigModel || idbLLMConfigModel.llmConfigId !== llmConfigId) {
			idbLLMConfigModel = await IdbLLMConfigModel.withLoad(llmConfigId);
		}
		llmConfigEditComponent.onChatProviderChange();
		modalElement.showModal();
	}
	async function remove(llmConfigId: string) {
		if (confirm("Are you sure you want to delete this chat model?")) {
			await IdbLLMConfigModel.delete(llmConfigId);
			modalElement.close();
		}
	}
	async function saveModel(event: CustomEvent) {
		if (event.detail.makeDefaultModel) {
			chatSettingsStore.defaultLLMConfigId = await idbLLMConfigModel.save();
			modalElement.close();
		} else {
			await idbLLMConfigModel.save();
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
	{#each $llmConfigListStore.list as model, index (model.llmConfigId)}
		<div
			class="border hover:bg-base-200 transition-all duration-200 hover:-translate-y-1 {$chatSettingsStore.defaultLLMConfigId ===
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
					<span class="border p-2">{model.type}</span>
					<span class="border p-2">{model.model}</span>
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
						disabled={$chatSettingsStore.defaultLLMConfigId ===
							model.llmConfigId}
						on:click={() =>
							(chatSettingsStore.defaultLLMConfigId = model.llmConfigId)}
					>
						{$chatSettingsStore.defaultLLMConfigId === model.llmConfigId
							? "✅"
							: ""}
						Make default
					</button>
					{#if $chatSettingsStore.defaultLLMConfigId !== model.llmConfigId}
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

<button
	class="btn btn-primary text-sm my-6"
	on:click={() => showModal(NEW_IDB_KEY)}
>
	<i class="fa-solid fa-plus" />
	New
</button>

<DaisyModal bind:this={modalElement} title="LLM config">
	{#if idbLLMConfigModel}
		<LLMConfigEdit
			bind:this={llmConfigEditComponent}
			bind:idbLLMConfigModel
			on:save={saveModel}
			{getConfigContainerComponent}
		/>
	{/if}
</DaisyModal>
