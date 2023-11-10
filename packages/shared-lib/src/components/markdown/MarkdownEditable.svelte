<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import SvelteMarkdown from "svelte-markdown";
	import Code from "./renderers/Code.svelte";
	export let source = "";
	export let index = -1;
	const dispatch = createEventDispatcher();

	let isClipboardButtonPressed = false;
	const copyText = (text: string) => {
		navigator.clipboard.writeText(text);
		isClipboardButtonPressed = true;
		setTimeout(() => {
			isClipboardButtonPressed = false;
		}, 2000);
	};

	let isEditMode = false;
	let textArea: HTMLTextAreaElement;
	function cancel() {
		isEditMode = false;
	}

	function save() {
		if (index === -1) {
			throw new Error("message index invalid");
		}
		console.log("source");
		console.log(source);
		console.log("textArea.value");
		console.log(textArea.value);
		source = textArea.value;
		dispatch("save", {
			content: source,
			index: index,
		});
		cancel();
	}

	function makeEditable() {
		isEditMode = true;
		setTimeout(() => {
			textArea.style.maxHeight = Math.floor(window.innerHeight / 2) + "px";
			textArea.style.height = "auto";
			textArea.style.height = textArea.scrollHeight + "px";
			textArea.focus();
		}, 100);
	}
</script>

<div class="w-full relative">
	{#if isEditMode}
		<textarea
			value={source}
			bind:this={textArea}
			class="textarea w-full textarea-bordered"
		/>
		<br />
		<button class="btn btn-sm" on:click={cancel}>cancel</button>
		<button class="btn btn-sm btn-primary" on:click={save}>save</button>
	{:else}
		<div class="mb-10">
			<SvelteMarkdown {source} renderers={{ code: Code }} />
		</div>

		<div class="absolute right-0 -bottom-10">
			<button class="btn btn-square btn-sm" on:click={makeEditable}>
				<i class="fa-solid fa-pen" />
			</button>
			<div
				data-tip={isClipboardButtonPressed ? "copied" : "copy"}
				class="tooltip tooltip-left"
			>
				<button class="btn btn-square btn-sm" on:click={() => copyText(source)}>
					{#if isClipboardButtonPressed}
						<i class="fa-solid fa-clipboard-check" />
					{:else}
						<i class="fa-solid fa-clipboard" />
					{/if}
				</button>
			</div>
		</div>
	{/if}
</div>
