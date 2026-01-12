<script lang="ts">
	import { Icon } from 'svelte-icon';
	import backIcon from '@mdi/svg/svg/arrow-left.svg?raw';
	import reloadIcon from '@mdi/svg/svg/reload.svg?raw';
	import { MediaQuery } from 'svelte/reactivity';

	let dialog: HTMLDialogElement;

	export function show() {
		dialog.showModal();
	}

	export function close() {
		dialog.close();
	}

	const isBrowser = new MediaQuery('display-mode: browser');
</script>

<dialog class="modal" bind:this={dialog}>
	<div class="modal-box">
		<div>
			{#if !isBrowser.current}
				<button class="btn btn-sm btn-ghost" onclick={() => history.back()}>
					<Icon data={backIcon} />
				</button>
				<button class="btn btn-sm btn-ghost" onclick={() => location.reload()}>
					<Icon data={reloadIcon} />
				</button>
			{/if}
			<h3 class="inline text-lg font-bold">Now Loading</h3>
		</div>
		<progress class="progress my-4"></progress>
	</div>
</dialog>
