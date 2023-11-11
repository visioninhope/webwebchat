<script lang="ts">
	let modalElement: HTMLDialogElement;
	export let title: string = "";
	export function showModal() {
		modalElement.showModal();
	}
	export function close() {
		modalElement.close();
	}
</script>

<dialog bind:this={modalElement} class="modal">
	<div class="modal-box max-w-fit text-base-content p-0 border">
		<!-- w-11/12  -->
		<div class="sticky top-0 bg-base-200 h-10 z-40">
			<div class="flex">
				<div class="flex-grow">
					<div class="p-2 text-xl font-extrabold">{title}</div>
				</div>
				<div class="flex p-1">
					<form method="dialog">
						<button class="btn btn-sm">
							<i class="fa-solid text-2xl fa-circle-xmark" />
						</button>
					</form>
				</div>
			</div>
		</div>
		<slot />
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
