<script lang="ts">
	export let model = "llama2";
	let customModel = false;
	const modelOptions = [
		"llama2",
		"mistral",
		"codellama",
		"vicuna",
		"orca-mini",
		"llama2-uncensored",
		"wizard-vicuna-uncensored",
		"nous-hermes",
		"phind-codellama",
		"wizardcoder",
		"wizard-math",
		"stable-beluga",
		"llama2-chinese",
		"codeup",
		"everythinglm",
		"wizardlm-uncensored",
		"medllama2",
		"wizard-vicuna",
		"falcon",
		"open-orca-platypus2",
		"zephyr",
		"mistral-openorca",
		"wizardlm",
		"starcoder",
		"samantha-mistral",
		"sqlcoder",
		"nexusraven",
		"openhermes2-mistral",
	];
	if (modelOptions.indexOf(model) === -1) {
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
				model = "llama2";
				customModel = false;
			}}
		>
			(Reset to default)
		</button>
	</span>
	{#if customModel || modelOptions.indexOf(model) === -1}
		<input
			class="input input-bordered input-primary"
			list="modelOptions"
			id="model"
			bind:value={model}
		/>
		<datalist id="modelOptions">
			{#each modelOptions as option}
				<option value={option}>{option}</option>
			{/each}
		</datalist>
	{:else}
		<select class="select select-bordered w-full" bind:value={model}>
			{#each modelOptions as option}
				<option value={option}>{option}</option>
			{/each}
		</select>
	{/if}
	<span class="form-control my-4">
		<label class="cursor-pointer">
			<input type="checkbox" bind:checked={customModel} class="checkbox" />
			<span class="">Custom</span>
		</label>
	</span>
	{#if customModel}
		<details>
			<summary>?</summary>
			<div>
				Available models: <a
					class="btn btn-xs btn-outline"
					target="_blank"
					rel="noreferrer noopener"
					href="https://ollama.ai/library"
				>
					Learn more →
				</a>
			</div>
		</details>
	{/if}
</div>
