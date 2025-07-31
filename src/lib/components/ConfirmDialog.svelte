<script lang="ts">
	let dialog: HTMLDialogElement;

	let headerStr = $state('');
	let bodyStr = $state('');
	let onOkFunc = $state((): void => {});

	export function show(header: string, body: string, onOk: () => void) {
		headerStr = header;
		bodyStr = body;
		onOkFunc = onOk;
		dialog.showModal();
	}
</script>

<dialog class="modal" bind:this={dialog}>
	<div class="modal-box">
		<h3 class="text-lg font-bold">Now Loading</h3>
		<p class="py-4">
			<span class="loading loading-spinner"></span>&nbsp;Please wait.
		</p>
		<div class="modal-action">
			<form method="dialog">
				<button
					class="btn btn-primary"
					onclick={() => {
						onOkFunc();
						dialog.close();
					}}
				>
					OK
				</button>
				<button class="btn btn-secondary" onclick={() => dialog.close()}> Cancel </button>
			</form>
		</div>
	</div>
</dialog>
