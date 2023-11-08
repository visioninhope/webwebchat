<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import BasicJsonEditor from "./configs/BasicJsonEditor.svelte";
	import OAIConfig from "./configs/OpenAI/OpenAIConfig.svelte";
	import { defaultSystemMessage } from "$lib/constants/constants";
	import { default_openai_fields } from "./configs/OpenAI/default_openai_fields";
	import { default_azure_fields } from "./configs/Azure/default_azure_fields";
	import { default_ollama_fields } from "./configs/Ollama/default_ollama_fields";
	import AzureConfig from "./configs/Azure/AzureConfig.svelte";
	import OllamaConfig from "./configs/Ollama/OllamaConfig.svelte";
	import AnthropicConfig from "./configs/Anthropic/AnthropicConfig.svelte";
	import { default_anthropic_fields } from "./configs/Anthropic/default_anthropic_fields";
	import { testLLM } from "$lib/llm/getLLM";
	import LogoType from "./logos/LogoType.svelte";
	import {
		LLMIntegrationTypeName,
		IdbLLMConfig,
	} from "$lib/idb-models/IdbLLMConfig";
	const dispatch = createEventDispatcher();

	export let idbLLMConfig: IdbLLMConfig;

	let activeTab = "FormEditor";
	let basicJsonEditor: BasicJsonEditor;
	let isTesting = false;
	let testResult:
		| {
				status: boolean;
				error: unknown;
		  }
		| undefined;
	let makeDefaultModel = true;

	async function onSave() {
		dispatch("save", {
			makeDefaultModel,
		});
	}
	function onChatProviderChange() {
		if (idbLLMConfig.type === LLMIntegrationTypeName.ChatOpenAI) {
			idbLLMConfig.config = default_openai_fields;
		} else if (idbLLMConfig.type === LLMIntegrationTypeName.ChatOpenAIAzure) {
			idbLLMConfig.config = default_azure_fields;
		} else if (idbLLMConfig.type === LLMIntegrationTypeName.ChatOllama) {
			idbLLMConfig.config = default_ollama_fields;
		} else if (idbLLMConfig.type === LLMIntegrationTypeName.ChatAnthropic) {
			idbLLMConfig.config = default_anthropic_fields;
		} else {
			throw new Error(`Unknown chat provider type: ${idbLLMConfig.type}`);
		}
		idbLLMConfig.systemMessage = defaultSystemMessage;
		if (basicJsonEditor) {
			basicJsonEditor.reloadJSON();
		}
	}

	function updateActiveTab(tab: string) {
		activeTab = tab;
		if (basicJsonEditor) {
			basicJsonEditor.reloadJSON();
		}
	}

	async function testBtnClick() {
		testResult = undefined;
		isTesting = true;
		testResult = await testLLM(idbLLMConfig);
		isTesting = false;
	}
</script>

{#if idbLLMConfig}
	<div class="divider">Select An LLM Provider</div>
	<div class="join join-vertical lg:join-horizontal mb-5">
		{#each Object.entries(LLMIntegrationTypeName) as [key, value]}
			<button
				class="btn join-item {value === idbLLMConfig.type
					? 'btn-primary'
					: 'btn-outline'}"
				on:click={() => {
					idbLLMConfig.type = value;
					onChatProviderChange();
				}}
			>
				<LogoType type={key} />
				{key.replace("Chat", "")}
			</button>
		{/each}
	</div>
	<!-- <div class="divider" /> -->

	<div class="tabs mb-10">
		<button
			class="tab tab-bordered {activeTab === 'FormEditor' ? 'tab-active' : ''}"
			on:click={() => updateActiveTab("FormEditor")}
		>
			Config
		</button>
		<button
			class="tab tab-bordered {activeTab === 'BasicJsonEditor'
				? 'tab-active'
				: ''}"
			on:click={() => updateActiveTab("BasicJsonEditor")}
		>
			JSON config
		</button>
	</div>

	{#if activeTab === "BasicJsonEditor"}
		<BasicJsonEditor
			bind:this={basicJsonEditor}
			bind:config={idbLLMConfig.config}
		/>
		{#if idbLLMConfig.type === LLMIntegrationTypeName.ChatOpenAI}
			<a
				href="https://js.langchain.com/docs/api/chat_models_openai/classes/ChatOpenAI#constructors"
				target="_blank"
			>
				ChatOpenAI
			</a>
		{:else if idbLLMConfig.type === LLMIntegrationTypeName.ChatOllama}
			<a
				href="https://js.langchain.com/docs/api/chat_models_ollama/classes/ChatOllama#constructors"
				target="_blank"
			>
				ChatOllama
			</a>
		{:else if idbLLMConfig.type === LLMIntegrationTypeName.ChatAnthropic}
			<a
				href="https://js.langchain.com/docs/api/chat_models_anthropic/classes/ChatAnthropic#constructors"
				target="_blank"
			>
				ChatAnthropic
			</a>
		{:else if idbLLMConfig.type === LLMIntegrationTypeName.ChatOpenAIAzure}
			<a
				href="https://js.langchain.com/docs/api/chat_models_openai/classes/ChatOpenAI#constructors"
				target="_blank"
			>
				ChatOpenAI
			</a>
		{/if}
	{:else if activeTab === "FormEditor"}
		{#if idbLLMConfig.type === LLMIntegrationTypeName.ChatOpenAI}
			<OAIConfig bind:idbLLMConfig />
		{:else if idbLLMConfig.type === LLMIntegrationTypeName.ChatOllama}
			<OllamaConfig bind:idbLLMConfig />
		{:else if idbLLMConfig.type === LLMIntegrationTypeName.ChatAnthropic}
			<AnthropicConfig bind:idbLLMConfig />
		{:else if idbLLMConfig.type === LLMIntegrationTypeName.ChatOpenAIAzure}
			<AzureConfig bind:idbLLMConfig />
		{/if}
	{/if}

	<div class="divider mt-20" />

	<div class="form-control mb-10">
		<span class="label">
			<span class="label-text">Name (optional)</span>
		</span>
		<input
			bind:value={idbLLMConfig.name}
			type="text"
			class="input input-bordered"
		/>
	</div>

	<div class="divider" />
	<label class="label cursor-pointer max-w-sm">
		<input type="checkbox" class="toggle" bind:checked={makeDefaultModel} />
		<span class="label-text">Remember settings for all future chats</span>
	</label>
	<div class="divider" />
	<div class="grid grid-cols-2 gap-4 mb-5">
		<div>
			<button
				class="btn btn-outline"
				on:click={testBtnClick}
				disabled={isTesting}
			>
				{#if isTesting}
					<span class="loading loading-spinner" />
				{/if}
				Test
			</button>
			{#if testResult}
				{#if testResult.status}
					<div class="alert alert-success inline">
						<span>Success</span>
					</div>
				{:else}
					<div class="alert alert-error inline">
						<span>Error: {testResult.error}</span>
					</div>
				{/if}
			{/if}
		</div>
	</div>
	<div class="divider" />
	<button class="btn btn-primary btn-block" on:click={onSave}>Save</button>
{/if}
