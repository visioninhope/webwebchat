<script lang="ts">
	export let modelName = "gpt-3.5-turbo";
	let customModel = false;
	const modelOptions = [
		"gpt-3.5-turbo",
		"gpt-4",
		"gpt-4-0314",
		"gpt-4-0613",
		"gpt-4-32k",
		"gpt-4-32k-0314",
		"gpt-4-32k-0613",
		"gpt-3.5-turbo-16k",
		"gpt-3.5-turbo-0301",
		"gpt-3.5-turbo-0613",
		"gpt-3.5-turbo-16k-0613",
	];
	if (modelOptions.indexOf(modelName) === -1) {
		customModel = true;
	}
</script>

<div class="form-control mb-10">
	<span class="label">
		<span class="label-text">Model Name</span>
		<button
			class="btn btn-sm btn-outline"
			type="button"
			on:click={() => {
				modelName = "gpt-3.5-turbo";
				customModel = false;
			}}
		>
			(Reset to default)
		</button>
	</span>
	{#if customModel || modelOptions.indexOf(modelName) === -1}
		<input
			class="input input-bordered input-primary"
			list="modelOptions"
			id="modelName"
			bind:value={modelName}
		/>
		<datalist id="modelOptions">
			{#each modelOptions as option}
				<option value={option}>{option}</option>
			{/each}
		</datalist>
	{:else}
		<select class="select select-bordered w-full" bind:value={modelName}>
			{#each modelOptions as option}
				<option value={option}>{option}</option>
			{/each}
		</select>
	{/if}
	<span class="form-control my-4">
		<label class="cursor-pointer">
			<input type="checkbox" bind:checked={customModel} class="checkbox" />
			<span class="">Custom/Fine-tuned Model</span>
		</label>
	</span>
	{#if customModel}
		<details>
			<summary>?</summary>
			<div>
				You can call fine-tuned OpenAI models by passing in your corresponding
				modelName parameter.
				<br />
				This generally takes the form of
				<code>
					ft:&#123;OPENAI_MODEL_NAME&#125;:&#123;ORG_NAME&#125;::&#123;MODEL_ID&#125;.
				</code>
				<br />
				For example:
				<code>
					'ft:gpt-3.5-turbo:&#123;ORG_NAME&#125;::&#123;MODEL_ID&#125;'
				</code>
				<a
					class="btn btn-xs btn-outline"
					target="_blank"
					rel="noreferrer noopener"
					href="https://js.langchain.com/docs/modules/model_io/models/chat/integrations/openai#calling-fine-tuned-models"
				>
					Learn more →
				</a>
			</div>
		</details>
	{/if}
</div>
