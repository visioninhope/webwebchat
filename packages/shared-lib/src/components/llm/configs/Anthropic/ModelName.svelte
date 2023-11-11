<script lang="ts">
	export let modelName = "claude-2";
	let customModel = false;
	const modelOptions = ["claude-2", "claude-instant-v1"];
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
				modelName = "claude-2";
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
					href="https://docs.anthropic.com/claude/reference/selecting-a-model"
				>
					Learn more →
				</a>
			</div>
		</details>
	{/if}
</div>
