<script lang="ts">
	import { defaultSystemMessage } from "$root/constants/constants";
	import { IdbLLMConfigModel } from "$root/idb-models/IdbLLMConfigModel";
	import ProviderButtons from "./ProviderButtons.svelte";
	import { getDefaultConfig } from "$root/constants/default-llm-configs/getDefaultConfig";
	import ConfigContainer from "./configs/ConfigContainer.svelte";
	import { SvelteComponent, onMount } from "svelte";
	import type { LLMTypeEnum } from "$root/types/LLMTypeEnum";
	import Webstore from "../utils/Webstore.svelte";
	export let idbLLMConfigModel: IdbLLMConfigModel;
	export let getConfigContainerComponent: (
		type: LLMTypeEnum
	) => typeof SvelteComponent | undefined;
	let configComponent: typeof SvelteComponent | undefined;

	export function onChatProviderChange() {
		if (idbLLMConfigModel) {
			configComponent = undefined;
			idbLLMConfigModel = idbLLMConfigModel;
			idbLLMConfigModel.config = getDefaultConfig(idbLLMConfigModel.type);
			idbLLMConfigModel.systemMessage = defaultSystemMessage;
			configComponent = getConfigContainerComponent(idbLLMConfigModel.type);
		}
	}

	onMount(() => {
		onChatProviderChange();
	});
</script>

<div class="p-2 max-w-4xl m-auto">
	{#if idbLLMConfigModel}
		<ProviderButtons bind:idbLLMConfigModel {onChatProviderChange} />
		{#if configComponent}
			<ConfigContainer on:save bind:idbLLMConfigModel bind:configComponent />
		{:else}
			<Webstore />
		{/if}
	{/if}
</div>
