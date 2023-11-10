<script lang="ts">
	import { toastStore } from "$root/stores/toastStore";
</script>

<div class="toast toast-top toast-end z-50">
	{#each $toastStore as toast, index}
		<div class={`alert ${toast.class} ${index}`}>
			<span>{toast.message}</span>
			<div>
				<button
					class="btn btn-sm btn-ghost"
					on:click={() => toastStore.removeItem(toast)}
				>
					<i class="fa-solid fa-times" />
				</button>
			</div>
		</div>
	{/each}
</div>
