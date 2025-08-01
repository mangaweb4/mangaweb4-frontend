<script lang="ts">
	import { Icon } from 'svelte-icon';
	import okIcon from '@mdi/svg/svg/check.svg?raw';
	import cancelIcon from '@mdi/svg/svg/cancel.svg?raw';

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
					<Icon data={okIcon} />&nbsp;OK
				</button>
				<button class="btn" onclick={() => dialog.close()}>
					<Icon data={cancelIcon} />&nbsp;Cancel
				</button>
			</form>
		</div>
	</div>
</dialog>
