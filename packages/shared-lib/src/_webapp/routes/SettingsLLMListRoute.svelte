<script lang="ts">
	import SettingsLLMList from "$root/components/llm/SettingsLLMList.svelte";
	import { LLMTypeEnum } from "$root/types/LLMTypeEnum";
	import type { SvelteComponent } from "svelte";

	const getConfigContainerComponent = async (type: LLMTypeEnum) => {
		switch (type) {
			case LLMTypeEnum.ChatOpenAI:
				return (
					await import(
						"$root/components/llm//configs/OpenAI/OpenAIConfig.svelte"
					)
				).default as typeof SvelteComponent;
			case LLMTypeEnum.ChatOpenAIAzure:
				return (
					await import("$root/components/llm//configs/Azure/AzureConfig.svelte")
				).default as typeof SvelteComponent;
			case LLMTypeEnum.ChatOllama:
				return (
					await import(
						"$root/components/llm//configs/Ollama/OllamaConfig.svelte"
					)
				).default as typeof SvelteComponent;
			default:
				return;
		}
	};
</script>

<SettingsLLMList {getConfigContainerComponent} />
