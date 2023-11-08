<script lang="ts">
	import { BASE_NAV } from "$lib/constants/BASE_NAV";
	import { location } from "svelte-spa-router";
</script>

<div class="tabs mb-5 tabs-boxed">
	<a
		href={BASE_NAV.SETTINGS}
		class="tab tab-lg tab-lifted"
		class:tab-active={$location === BASE_NAV.RM_HASH(BASE_NAV.SETTINGS)}
	>
		<!-- <i class="fa-solid fa-gear" /> -->
		Settings
	</a>
	<a
		href={BASE_NAV.LLMS}
		class="tab tab-lg tab-lifted"
		class:tab-active={$location === BASE_NAV.RM_HASH(BASE_NAV.LLMS)}
	>
		<!-- <i class="fa-solid fa-robot" /> -->
		LLMs
	</a>
</div>
