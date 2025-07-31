<script lang="ts">
	let dialog: HTMLDialogElement;

	export function show() {
		dialog.showModal();
	}

	export function close() {
		dialog.close();
	}
</script>

<dialog class="modal" bind:this={dialog}>
	<div class="modal-box">
		<h3 class="text-lg font-bold">Now Loading</h3>
		<p class="py-4">
			<span class="loading loading-spinner"></span>&nbsp;Please wait.
		</p>
	</div>
</dialog>
