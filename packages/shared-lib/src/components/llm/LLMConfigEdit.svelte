<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import BasicJsonEditor from "./configs/BasicJsonEditor.svelte";
	import OAIConfig from "./configs/OpenAI/OpenAIConfig.svelte";
	import { defaultSystemMessage } from "$root/constants//constants";
	import { default_openai_fields } from "$root/constants//default-llm-configs/default_openai_fields";
	import { default_azure_fields } from "$root/constants//default-llm-configs/default_azure_fields";
	import { default_ollama_fields } from "$root/constants//default-llm-configs/default_ollama_fields";
	import AzureConfig from "./configs/Azure/AzureConfig.svelte";
	import OllamaConfig from "./configs/Ollama/OllamaConfig.svelte";
	import { testLLM } from "$root/managers/getLLM";
	import LogoType from "$root/components/logos/LogoType.svelte";
	import { IdbLLMConfigModel } from "$root/idb-models/IdbLLMConfigModel";
	import { LLMTypeEnum } from "$root/types/LLMTypeEnum";
	const dispatch = createEventDispatcher();

	export let idbLLMConfigModel: IdbLLMConfigModel;

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
		if (idbLLMConfigModel.type === LLMTypeEnum.ChatOpenAI) {
			idbLLMConfigModel.config = default_openai_fields;
		} else if (idbLLMConfigModel.type === LLMTypeEnum.ChatOpenAIAzure) {
			idbLLMConfigModel.config = default_azure_fields;
		} else if (idbLLMConfigModel.type === LLMTypeEnum.ChatOllama) {
			idbLLMConfigModel.config = default_ollama_fields;
		} else if (idbLLMConfigModel.type === LLMTypeEnum.ChatAnthropic) {
			// do nothing
		} else {
			throw new Error(`Unknown chat provider type: ${idbLLMConfigModel.type}`);
		}
		idbLLMConfigModel.systemMessage = defaultSystemMessage;
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
		testResult = await testLLM(idbLLMConfigModel);
		isTesting = false;
	}
</script>

{#if idbLLMConfigModel}
	<div class="divider">Select An LLM Provider</div>
	<div class="join join-vertical lg:join-horizontal mb-5">
		{#each Object.entries(LLMTypeEnum) as [key, value]}
			<button
				class="btn join-item {value === idbLLMConfigModel.type
					? 'btn-primary'
					: 'btn-outline'}"
				on:click={() => {
					idbLLMConfigModel.type = value;
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
			bind:config={idbLLMConfigModel.config}
		/>
		{#if idbLLMConfigModel.type === LLMTypeEnum.ChatOpenAI}
			<a
				href="https://js.langchain.com/docs/api/chat_models_openai/classes/ChatOpenAI#constructors"
				target="_blank"
			>
				ChatOpenAI
			</a>
		{:else if idbLLMConfigModel.type === LLMTypeEnum.ChatOllama}
			<a
				href="https://js.langchain.com/docs/api/chat_models_ollama/classes/ChatOllama#constructors"
				target="_blank"
			>
				ChatOllama
			</a>
		{:else if idbLLMConfigModel.type === LLMTypeEnum.ChatOpenAIAzure}
			<a
				href="https://js.langchain.com/docs/api/chat_models_openai/classes/ChatOpenAI#constructors"
				target="_blank"
			>
				ChatOpenAI
			</a>
		{/if}
	{:else if activeTab === "FormEditor"}
		{#if idbLLMConfigModel.type === LLMTypeEnum.ChatOpenAI}
			<OAIConfig bind:idbLLMConfigModel />
		{:else if idbLLMConfigModel.type === LLMTypeEnum.ChatOllama}
			<OllamaConfig bind:idbLLMConfigModel />
		{:else if idbLLMConfigModel.type === LLMTypeEnum.ChatAnthropic}
			Anthropic API does not allow requests from other websites.
			<br />
			Because of this reason, it is supported with extension only.
			<br />
			(Browser limitation: 'CORS')
		{:else if idbLLMConfigModel.type === LLMTypeEnum.ChatOpenAIAzure}
			<AzureConfig bind:idbLLMConfigModel />
		{/if}
	{/if}

	{#if idbLLMConfigModel.type === LLMTypeEnum.ChatAnthropic}
		<!-- hide -->
	{:else}
		<div class="divider mt-20" />

		<div class="form-control mb-10">
			<span class="label">
				<span class="label-text">Name (optional)</span>
			</span>
			<input
				bind:value={idbLLMConfigModel.name}
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
{/if}
