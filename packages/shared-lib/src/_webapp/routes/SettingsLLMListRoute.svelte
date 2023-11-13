<script lang="ts">
	import AzureConfig from "$root/components/llm//configs/Azure/AzureConfig.svelte";
	import OllamaConfig from "$root/components/llm//configs/Ollama/OllamaConfig.svelte";
	import OpenAIConfig from "$root/components/llm//configs/OpenAI/OpenAIConfig.svelte";
	import SettingsLLMList from "$root/components/llm/SettingsLLMList.svelte";
	import { LLMTypeEnum } from "$root/types/LLMTypeEnum";
	import type { SvelteComponent } from "svelte";

	const getConfigContainerComponent = (type: LLMTypeEnum) => {
		switch (type) {
			case LLMTypeEnum.ChatOpenAI:
				return OpenAIConfig as typeof SvelteComponent;
			// return (
			// 	await import(
			// 		"$root/components/llm//configs/OpenAI/OpenAIConfig.svelte"
			// 	)
			// ).default as typeof SvelteComponent;
			case LLMTypeEnum.ChatOpenAIAzure:
				return AzureConfig as typeof SvelteComponent;
			case LLMTypeEnum.ChatOllama:
				return OllamaConfig as typeof SvelteComponent;
			default:
				return;
		}
	};
</script>

<SettingsLLMList {getConfigContainerComponent} />
