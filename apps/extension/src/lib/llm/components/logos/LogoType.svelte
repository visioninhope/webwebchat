<script lang="ts">
	import { LLMIntegrationTypeName } from "$lib/idb-models/IdbLLMConfig";
	import LogoAnthropic from "./LogoAnthropic.svelte";
	import LogoAzure from "./LogoAzure.svelte";
	import LogoOllama from "./LogoOllama.svelte";
	import LogoOpenai from "./LogoOpenai.svelte";
	export let type: string;
</script>

{#if type === LLMIntegrationTypeName.ChatOpenAI}
	<LogoOpenai />
{:else if type === LLMIntegrationTypeName.ChatAnthropic}
	<LogoAnthropic />
{:else if type === LLMIntegrationTypeName.ChatOllama}
	<LogoOllama />
{:else if type === LLMIntegrationTypeName.ChatOpenAIAzure}
	<LogoAzure />
{:else}
	<span class="text-3xl">🫥</span>
{/if}
