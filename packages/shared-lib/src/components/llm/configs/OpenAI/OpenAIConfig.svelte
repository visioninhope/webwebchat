<script lang="ts">
	import PasswordInputWrapper from "$root/components/PasswordInputWrapper.svelte";
	import { BASE_NAV } from "$root/constants/BASE_NAV";
	import { defaultSystemMessage } from "$root/constants//constants";
	import type { IdbLLMConfigModel } from "$root/idb-models/IdbLLMConfigModel";
	import ModelName from "./ModelName.svelte";
	export let idbLLMConfigModel: IdbLLMConfigModel;
</script>

<div class="space-y-20">
	<ModelName bind:modelName={idbLLMConfigModel.config.modelName} />

	<div>
		<div>
			<div class="flex items-center font-semibold">
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
		<div class="space-y-20">
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
						class="btn btn-xs btn-outline tooltip"
						target="_blank"
						rel="noreferrer noopener"
						data-tip="
						What sampling temperature to use, between 0 and 2. 
						Higher values like 0.8 will make the output more random, 
						while lower values like 0.2 will make it more focused and deterministic.
						We generally recommend altering this or top_p but not both.
						"
						href="https://platform.openai.com/docs/api-reference/chat/create#chat/create-temperature"
					>
						Learn more →
					</a>
				</div>
				<div class="text-xs my-1">
					Higher values like 1.8 will make the output more random, while lower
					values like 0.2 will make it more focused and deterministic.
				</div>
				<input
					type="range"
					class="range range-primary"
					bind:value={idbLLMConfigModel.config.temperature}
					min="0"
					max="2"
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
						class="btn btn-xs btn-outline tooltip"
						target="_blank"
						rel="noreferrer noopener"
						data-tip="
						An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. 
						So 0.1 means only the tokens comprising the top 10% probability mass are considered.
						We generally recommend altering this or temperature but not both."
						href="https://platform.openai.com/docs/api-reference/chat/create#chat/create-top_p"
					>
						Learn more →
					</a>
				</div>
				<div class="text-xs my-1">
					An alternative to sampling with temperature, called nucleus sampling,
					where the model considers the results of the tokens with top_p
					probability mass. So 0.1 means only the tokens comprising the top 10%
					probability mass are considered.
				</div>
				<input
					type="range"
					class="range range-primary"
					min="0"
					max="1"
					step="0.1"
					bind:value={idbLLMConfigModel.config.topP}
				/>
				<div class="flex items-center font-semibold">
					<div>Precise</div>
					<div>Creative</div>
				</div>
			</div>

			<div class="divider" />

			<div class="">
				<div class="font-semibold space-x-2 flex">
					<div>
						<span>
							Frequency Penalty: {idbLLMConfigModel.config.frequencyPenalty}
						</span>
						<button
							class="btn btn-sm btn-outline"
							type="button"
							on:click={() => {
								idbLLMConfigModel.config.frequencyPenalty = 0;
							}}
						>
							(Reset to default)
						</button>
					</div>
					<a
						class="btn btn-xs btn-outline tooltip"
						target="_blank"
						data-tip="
						Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency 
						in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
						"
						rel="noreferrer noopener"
						href="https://platform.openai.com/docs/api-reference/chat/create#chat/create-frequency_penalty"
					>
						Learn more →
					</a>
				</div>
				<div class="text-xs my-1">
					How much to penalize new tokens based on their existing frequency in
					the text so far. Decreases the model's likelihood to repeat the same
					line verbatim.
				</div>
				<input
					type="range"
					class="range range-primary"
					min="-2"
					max="2"
					step="0.1"
					bind:value={idbLLMConfigModel.config.frequencyPenalty}
				/>
				<div class="flex items-center font-semibold">
					<div>Balanced</div>
					<div>Less Repetition</div>
				</div>
			</div>

			<div class="divider" />

			<div class="">
				<div class="font-semibold space-x-2 flex">
					<div>
						<span>
							Presence Penalty: {idbLLMConfigModel.config.presencePenalty}
						</span>
						<button
							class="btn btn-sm btn-outline"
							type="button"
							on:click={() => {
								idbLLMConfigModel.config.presencePenalty = 0;
							}}
						>
							(Reset to default)
						</button>
					</div>
					<a
						class="btn btn-xs btn-outline tooltip"
						target="_blank"
						data-tip="
						Number between -2.0 and 2.0. Positive values penalize new tokens based on whether 
						they appear in the text so far, increasing the model's likelihood to talk about new topics."
						rel="noreferrer noopener"
						href="https://platform.openai.com/docs/api-reference/chat/create#chat/create-presence_penalty"
					>
						Learn more →
					</a>
				</div>
				<div class="text-xs my-1">
					How much to penalize new tokens based on whether they appear in the
					text so far. Increases the model's likelihood to talk about new
					topics.
				</div>
				<input
					type="range"
					class="range range-primary"
					min="-2"
					max="2"
					step="0.1"
					bind:value={idbLLMConfigModel.config.presencePenalty}
				/>
				<div class="flex items-center font-semibold">
					<div>Balanced</div>
					<div>Open-minded</div>
				</div>
			</div>

			<div class="divider" />

			<div>
				<div class="form-control mb-10">
					<div class="flex">
						<span class="label">
							<span class="label-text">Base URL</span>
							<button
								class="btn btn-sm btn-outline"
								type="button"
								on:click={() => {
									idbLLMConfigModel.config.configuration.baseURL =
										"https://api.openai.com/v1";
								}}
							>
								(Reset to default)
							</button>
						</span>
					</div>
					<div class="text-xs my-1">
						* Must be compatible with /v1/chat/completions
					</div>
					<input
						bind:value={idbLLMConfigModel.config.configuration.baseURL}
						type="text"
						class="input input-bordered"
					/>
				</div>
			</div>
		</div>
	</details>

	<div class="divider" />

	<details>
		<summary
			class="text-primary font-semibold my-2 cursor-pointer hover:underline"
		>
			Override global settings
		</summary>
		<div class="form-control mb-10">
			<span class="label">
				<span class="label-text">OpenAI API Key</span>
				<a
					class="link"
					target="_blank"
					href="https://platform.openai.com/account/api-keys"
				>
					(Get API key here)
				</a>
			</span>
			<div class="text-xs my-1">
				If empty, the <u>OpenAI API KEY</u>
				in the
				<a href={BASE_NAV.SETTINGS}>global settings</a>
				will be used.
				<br />
				However, if you want to use a different API key for this model, you can enter
				it here.
			</div>
			<PasswordInputWrapper
				bind:value={idbLLMConfigModel.config.openAIApiKey}
			/>
		</div>
	</details>
</div>
