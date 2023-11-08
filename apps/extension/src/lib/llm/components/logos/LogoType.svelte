<script lang="ts">
	import { LLMTypeEnum } from "shared-types/LLMTypeEnum";
	import LogoAnthropic from "./LogoAnthropic.svelte";
	import LogoAzure from "./LogoAzure.svelte";
	import LogoOllama from "./LogoOllama.svelte";
	import LogoOpenai from "./LogoOpenai.svelte";
	export let type: string;
</script>

{#if type === LLMTypeEnum.ChatOpenAI}
	<LogoOpenai />
{:else if type === LLMTypeEnum.ChatAnthropic}
	<LogoAnthropic />
{:else if type === LLMTypeEnum.ChatOllama}
	<LogoOllama />
{:else if type === LLMTypeEnum.ChatOpenAIAzure}
	<LogoAzure />
{:else}
	<span class="text-3xl">🫥</span>
{/if}
