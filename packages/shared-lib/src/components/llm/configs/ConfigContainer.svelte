<script lang="ts">
	import Tab from "$root/components/utils/tabs/Tab.svelte";
	import Tabs from "$root/components/utils/tabs/Tabs.svelte";
	import type { IdbLLMConfigModel } from "$root/idb-models/IdbLLMConfigModel";
	import { testLLM } from "$root/managers/getLLM";
	import { LLMTypeEnum } from "$root/types/LLMTypeEnum";
	import { createEventDispatcher, type SvelteComponent } from "svelte";
	import BasicJsonEditor from "../BasicJsonEditor.svelte";
	const dispatch = createEventDispatcher();
	export let idbLLMConfigModel: IdbLLMConfigModel;
	export let configComponent: typeof SvelteComponent;

	let isTesting = false;
	let testResult:
		| {
				status: boolean;
				error: unknown;
		  }
		| undefined;
	async function testBtnClick() {
		testResult = undefined;
		isTesting = true;
		testResult = await testLLM(idbLLMConfigModel);
		isTesting = false;
	}

	let makeDefaultModel = true;

	async function onSave() {
		dispatch("save", {
			makeDefaultModel,
		});
	}
</script>

<Tabs let:tabs let:active defaultTab="Config">
	<Tab {tabs} {active} title="Config">
		<!-- <OpenAiConfig bind:idbLLMConfigModel /> -->
		<svelte:component this={configComponent} bind:idbLLMConfigModel />
	</Tab>
	<Tab {tabs} {active} title="Advanced">
		<BasicJsonEditor bind:config={idbLLMConfigModel.config} />

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
	</Tab>
</Tabs>

<div class="divider mt-20" />

<div class="form-control mb-10 tooltip" data-tip="to make it easy to remember">
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
<!-- <div class="divider" /> -->
<!-- <div class="sticky bottom-0 h-10 z-40"></div> -->
<div class="sticky bottom-0 h-10 z-40">
	<button class="btn btn-primary btn-block font-extrabold" on:click={onSave}>
		Save
	</button>
</div>
