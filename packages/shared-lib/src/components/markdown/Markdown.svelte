<script lang="ts">
	import SvelteMarkdown from "svelte-markdown";
	import Code from "./renderers/Code.svelte";
	export let source = "";
</script>

<div class="w-full relative">
	<SvelteMarkdown {source} renderers={{ code: Code }} />
</div>
