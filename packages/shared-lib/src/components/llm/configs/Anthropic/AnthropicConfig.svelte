<script lang="ts">
	import AnthropicSettings from "$root/components/settings/AnthropicSettings.svelte";
	import { defaultSystemMessage } from "$root/constants/constants";
	import type { IdbLLMConfigModel } from "$root/idb-models/IdbLLMConfigModel";
	import ModelName from "./ModelName.svelte";
	export let idbLLMConfigModel: IdbLLMConfigModel;
</script>

<h1>AnthropicSettingsAnthropicSettings</h1>

<div class="space-y-20">
	<AnthropicSettings />

	<ModelName bind:modelName={idbLLMConfigModel.config.modelName} />

	<div class="">
		<div class="flex items-center">
			<div class="block text-sm font-medium leading-6">
				Initial System Instruction
				<button
					class="btn btn-sm btn-outline"
					type="button"
					on:click={() => {
						idbLLMConfigModel.systemMessage = defaultSystemMessage;
					}}
				>
					(Reset to default)
				</button>
			</div>
			<a
				class="btn btn-xs btn-outline tooltip"
				target="_blank"
				data-tip=""
				rel="noreferrer noopener"
				href="https://docs.anthropic.com/claude/docs/constructing-a-prompt#system-prompt-optional"
			>
				Learn more →
			</a>
		</div>
		<textarea
			placeholder={defaultSystemMessage}
			class="textarea w-full textarea-bordered"
			rows="3"
			bind:value={idbLLMConfigModel.systemMessage}
		/>
	</div>

	<label class="label cursor-pointer max-w-sm">
		<input
			type="checkbox"
			class="toggle"
			bind:checked={idbLLMConfigModel.config.streaming}
		/>
		<span class="label-text">
			Stream AI responses word by word
			{idbLLMConfigModel.config.streaming ? "(enabled)" : "(disabled)"}
		</span>
	</label>

	<div class="divider" />

	<details>
		<summary
			class="text-primary font-semibold my-2 cursor-pointer hover:underline"
		>
			More customizations
		</summary>
		<div class="space-y-20 m-5 border p-5">
			<div class="">
				<div class="font-semibold space-x-2 flex">
					<div>
						<span>Temperature: {idbLLMConfigModel.config.temperature}</span>
						<button
							class="btn btn-sm btn-outline"
							type="button"
							on:click={() => {
								idbLLMConfigModel.config.temperature = 1;
							}}
						>
							(Reset to default)
						</button>
					</div>
					<a
						class="btn btn-xs btn-outline"
						target="_blank"
						rel="noreferrer noopener"
						href="https://docs.anthropic.com/claude/reference/complete_post"
					>
						Learn more →
					</a>
				</div>
				<div class="text-xs my-1">
					Amount of randomness injected into the response. Ranges from 0 to 1.
					Use temp closer to 0 for analytical / multiple choice, and temp closer
					to 1 for creative and generative tasks.
				</div>
				<input
					type="range"
					class="range range-primary"
					bind:value={idbLLMConfigModel.config.temperature}
					min="0"
					max="1"
					step="0.1"
				/>
				<div class="flex items-center font-semibold">
					<div>Precise</div>
					<div>Neutral</div>
					<div>Creative</div>
				</div>
			</div>

			<div class="divider" />

			<div class="">
				<div class="font-semibold space-x-2 flex">
					<div>
						<span>Top K: {idbLLMConfigModel.config.topK}</span>
						<button
							class="btn btn-sm btn-outline"
							type="button"
							on:click={() => {
								idbLLMConfigModel.config.topK = -1;
							}}
						>
							(Reset to default)
						</button>
					</div>
					<a
						class="btn btn-xs btn-outline"
						target="_blank"
						rel="noreferrer noopener"
						href="https://towardsdatascience.com/how-to-sample-from-language-models-682bceb97277"
					>
						Learn more →
					</a>
				</div>
				<div class="text-xs my-1">
					Only sample from the top K options for each subsequent token. Used to
					remove "long tail" low probability responses. Defaults to -1, which
					disables it.
				</div>
				<input
					type="text"
					class="input input-bordered"
					bind:value={idbLLMConfigModel.config.topK}
				/>
			</div>

			<div class="divider" />

			<div class="">
				<div class="font-semibold space-x-2 flex">
					<div>
						<span>Top P: {idbLLMConfigModel.config.topP}</span>
						<button
							class="btn btn-sm btn-outline"
							type="button"
							on:click={() => {
								idbLLMConfigModel.config.topP = 1;
							}}
						>
							(Reset to default)
						</button>
					</div>
					<a
						class="btn btn-xs btn-outline"
						target="_blank"
						rel="noreferrer noopener"
						href="https://docs.anthropic.com/claude/reference/complete_post"
					>
						Learn more →
					</a>
				</div>
				<div class="text-xs my-1">
					Does nucleus sampling, in which we compute the cumulative distribution
					over all the options for each subsequent token in decreasing
					probability order and cut it off once it reaches a particular
					probability specified by top_p. Defaults to -1, which disables it.
					Note that you should either alter temperature or top_p, but not both.
					max:1
				</div>
				<input
					type="range"
					class="range range-primary"
					min="0"
					max="1"
					step="0.1"
					bind:value={idbLLMConfigModel.config.topP}
				/>
			</div>

			<div class="divider" />

			<div>
				<div class="form-control mb-10">
					<div class="flex">
						<span class="label">
							<span class="label-text">Anthropic Api Url</span>
							<button
								class="btn btn-sm btn-outline"
								type="button"
								on:click={() => {
									idbLLMConfigModel.config.anthropicApiUrl =
										"https://api.anthropic.com";
								}}
							>
								(Reset to default)
							</button>
						</span>
					</div>
					<input
						bind:value={idbLLMConfigModel.config.anthropicApiUrl}
						type="text"
						class="input input-bordered"
					/>
				</div>
			</div>
		</div>
	</details>

	<!-- <div class="divider" />
	<OverrideApiKey /> -->
</div>
