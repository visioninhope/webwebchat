<script lang="ts">
	import { onMount } from "svelte";

	export let value = "";

	let textArea: HTMLTextAreaElement;

	onMount(() => {
		textArea.style.maxHeight = Math.floor(window.innerHeight / 2) + "px";
		textArea.style.height = "auto";
		textArea.style.height = textArea.scrollHeight + "px";
	});

	const resize = (event?: Event) => {
		if (textArea) {
			if (value === "") {
				textArea.style.height = "auto";
				// textArea.style.height = textArea.scrollHeight + "px";
				return;
			}
			let currentHeight = parseInt(textArea.style.height, 10);
			if (isNaN(currentHeight) || currentHeight < textArea.scrollHeight) {
				textArea.style.height = "auto";
				textArea.style.height = textArea.scrollHeight + "px";
			}
		}
	};

	$: {
		value;
		resize();
	}
</script>

<textarea bind:this={textArea} on:keydown bind:value {...$$restProps} />
