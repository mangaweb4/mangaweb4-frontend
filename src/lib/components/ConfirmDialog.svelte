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
		<h3 class="text-lg font-bold">{headerStr}</h3>
		<p class="py-4">
			{bodyStr}
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
				<button class="btn" onclick={() => dialog.close()}> Cancel </button>
			</form>
		</div>
	</div>
</dialog>
