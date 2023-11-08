<script lang="ts">
	import { onMount } from "svelte";
	import ModelName from "./ModelName.svelte";
	import Code from "ui/components/markdown/renderers/Code.svelte";
	import { defaultSystemMessage } from "$lib/constants/constants";
	import type { IdbLLMConfig } from "$lib/idb-models/IdbLLMConfig";
	export let idbLLMConfig: IdbLLMConfig;
	let worigin = "";
	onMount(() => {
		worigin = window.location.origin;
	});
</script>

<div class="space-y-20">
	Ollama helps you run your own chatbot server. Once you download the model you
	can use it without internet connection.
	<a class="link link-primary" href="https://ollama.ai/" target="_blank">
		Install ollama desktop
	</a>
	. Then run the following command in your terminal:
	<Code
		text="OLLAMA_ORIGINS={worigin} OLLAMA_HOST=127.0.0.1:11434 ollama serve"
	/>

	once ready click the test button.

	<ModelName bind:model={idbLLMConfig.config.model} />

	<div>
		<div>
			<div class="flex items-center font-semibold">
				<div class="block text-sm font-medium leading-6">
					Initial System Instruction
					<button
						class="btn btn-sm btn-outline"
						type="button"
						on:click={() => {
							idbLLMConfig.systemMessage = defaultSystemMessage;
						}}
					>
						(Reset to default)
					</button>
				</div>
				<a
					class="btn btn-xs btn-outline tooltip"
					target="_blank"
					data-tip="Click to see strategies for getting better results"
					rel="noreferrer noopener"
					href="https://platform.openai.com/docs/guides/chat/instructing-chat-models"
				>
					Learn more →
				</a>
			</div>
		</div>
		<textarea
			placeholder={defaultSystemMessage}
			class="textarea w-full textarea-bordered"
			rows="3"
			bind:value={idbLLMConfig.systemMessage}
		/>
	</div>

	<div class="divider" />

	<div>
		<div class="form-control mb-10">
			<div class="flex">
				<span class="label">
					<span class="label-text">Base Url</span>
				</span>
				<button
					class="btn btn-sm btn-outline"
					type="button"
					on:click={() => {
						idbLLMConfig.config.baseUrl = "http://localhost:11434";
					}}
				>
					(Reset to default)
				</button>
			</div>
			<input
				bind:value={idbLLMConfig.config.baseUrl}
				type="text"
				class="input input-bordered"
			/>
		</div>
	</div>
</div>
