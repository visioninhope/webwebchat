<script lang="ts">
	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();
	export let value = "";
	let error = "";
	const validateInput = (event: Event) => {
		const target = event.target as HTMLInputElement;
		const value = target.value;
		let pattern = $$props.pattern || "";
		if ($$props.required && !value) {
			error = $$props.required ? "required" : "";
		} else if (pattern) {
			const regex = new RegExp(pattern);
			if (!regex.test(value)) {
				error = $$props.patternError || "invalid";
			} else {
				error = "";
			}
		} else {
			error = "";
		}

		if (error) {
			target.classList.add("input-error");
		} else {
			target.classList.remove("input-error");
		}
		dispatch("input", event);
	};
</script>

<div class="form-control w-full">
	<!-- 
		on:keydown
	on:keyup
	on:keypress
	on:focus
	on:blur 
-->
	<input bind:value on:input={validateInput} {...$$restProps} />
	<span class="label">
		{#if error}
			<span class="label-text-alt text-error">{error}</span>
		{/if}
	</span>
</div>

<!-- 

	SAMPLE USAGE with pattern
	
<InputWrapper
	type="text"
	class="input input-bordered w-full"
	placeholder="https://w..."
	bind:value={url}
	pattern="http://.*|https://.*"
	patternError="invalid URL"
	required
	disabled={loading}
	name="wb-url"
/> 
-->
