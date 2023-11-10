<script lang="ts">
	let showPassword = false;
	export let value = "";
</script>

<div class="join">
	{#if showPassword}
		<input
			type="text"
			bind:value
			class="input input-bordered join-item w-full"
			{...$$restProps}
		/>
	{:else}
		<input
			type="password"
			bind:value
			class="input input-bordered join-item w-full"
			{...$$restProps}
		/>
	{/if}

	<button
		class="join-item btn btn-square btn-outline tooltip tooltip-left"
		data-tip="Show/Hide"
		on:click={() => (showPassword = !showPassword)}
	>
		<i class="fa-solid fa-eye{showPassword ? '-slash' : ''}" />
	</button>
</div>
