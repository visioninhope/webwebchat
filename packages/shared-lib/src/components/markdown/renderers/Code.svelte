<script lang="ts">
	export let lang = "";
	export let text = "";

	let isClipboardButtonPressed = false;
	const copyText = (text: string) => {
		navigator.clipboard.writeText(text);
		isClipboardButtonPressed = true;
		setTimeout(() => {
			isClipboardButtonPressed = false;
		}, 2000);
	};
</script>

<div class="mockup-code max-w-full min-w-0 relative mr-5">
	<pre class={lang}><code>{text}</code></pre>
	<div class="absolute right-2 top-2">
		<div
			data-tip={isClipboardButtonPressed ? "copied" : "copy"}
			class="tooltip tooltip-left"
		>
			<button class="btn btn-square btn-sm" on:click={() => copyText(text)}>
				{#if isClipboardButtonPressed}
					<i class="fa-solid fa-clipboard-check" />
				{:else}
					<i class="fa-solid fa-clipboard" />
				{/if}
			</button>
		</div>
	</div>
</div>
