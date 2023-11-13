<script lang="ts">
	import LogoType from "$root/components/logos/LogoType.svelte";
	import type { IdbLLMConfigModel } from "$root/idb-models/IdbLLMConfigModel";
	import { LLMTypeEnum } from "$root/types/LLMTypeEnum";
	export let idbLLMConfigModel: IdbLLMConfigModel;
	export let onChatProviderChange: () => void;
</script>

<div class="divider">Select An LLM Provider</div>
<div class="join join-vertical sm:join-horizontal mb-5">
	{#each Object.entries(LLMTypeEnum) as [key, value]}
		<button
			class="btn join-item {value === idbLLMConfigModel.type
				? 'btn-primary'
				: 'btn-outline'}"
			on:click={() => {
				idbLLMConfigModel.type = value;
				onChatProviderChange();
			}}
		>
			<LogoType type={key} />
			{key.replace("Chat", "")}
		</button>
	{/each}
</div>
