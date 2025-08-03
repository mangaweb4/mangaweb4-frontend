<script lang="ts">
	import { goto } from '$app/navigation';
	import { Icon } from 'svelte-icon';
	import { page } from '$app/state';

	import goIcon from '@mdi/svg/svg/arrow-right-circle.svg?raw';
	import moveUpIcon from '@mdi/svg/svg/arrow-up-box.svg?raw';
	import pageIcon from '@mdi/svg/svg/page-next.svg?raw';
	import firstPageIcon from '@mdi/svg/svg/page-first.svg?raw';
	import previousPageIcon from '@mdi/svg/svg/chevron-left.svg?raw';
	import nextPageIcon from '@mdi/svg/svg/chevron-right.svg?raw';
	import lastPageIcon from '@mdi/svg/svg/page-last.svg?raw';

	function moveToTop() {
		location.hash = '#top';
		location.hash = '';
	}

	interface Props {
		currentPage?: number;
		totalPage?: number;
	}

	let { currentPage = 0, totalPage = 1 }: Props = $props();

	let customPage = $state(currentPage);

	function gotoPage(i: number) {
		goto(createLink(i));
	}

	function createLink(i: number): URL {
		let url = new URL(page.url);
		url.searchParams.set('page', i.toString());

		return url;
	}

	let customInput: HTMLDialogElement;
</script>

<div class="fixed bottom-10 inset-x-1/2 md:hidden">
	<div class="join -translate-x-1/2">
		<button class="join-item btn" onclick={() => customInput.showModal()}>
			<Icon data={pageIcon} /> Page
		</button>

		<button class="join-item btn" onclick={moveToTop}>
			<Icon data={moveUpIcon} />
			<span class="d-none d-sm-block">Top</span>
		</button>
	</div>
</div>

<dialog class="modal modal-bottom" bind:this={customInput}>
	<div class="modal-box w-full max-w-[640px] mx-auto">
		<h3 class="text-lg font-bold">Move to page</h3>
		<div class="py-4">
			<p>Current page: {currentPage}</p>
			<div class="join">
				<button class="join-item btn" onclick={() => goto(createLink(0))}>
					<Icon data={firstPageIcon} /> <div class="text hidden sm:block">First</div></button
				>
				<button
					class="join-item btn"
					class:btn-disabled={currentPage - 1 < 0}
					onclick={() => goto(createLink(currentPage - 1))}
				>
					<Icon data={previousPageIcon} /> <div class="text hidden sm:block">Previous</div>
				</button>
				<button
					class="join-item btn"
					class:btn-disabled={currentPage + 1 > totalPage - 1}
					onclick={() => goto(createLink(currentPage + 1))}
				>
					<Icon data={nextPageIcon} /> <div class="text hidden sm:block">Next</div>
				</button>
				<button class="join-item btn" onclick={() => goto(createLink(totalPage - 1))}>
					<Icon data={lastPageIcon} /> <div class="text hidden sm:block">Last</div>
				</button>
			</div>
			<div class="join mt-3">
				<button class="join-item btn" onclick={() => (customPage = Math.max(customPage - 1, 0))}>
					-
				</button>
				<input
					type="number"
					class="input join-item"
					bind:value={customPage}
					placeholder="page #"
					max={totalPage - 1}
					min={0}
				/>
				<button
					class="join-item btn"
					onclick={() => (customPage = Math.min(customPage + 1, totalPage - 1))}
				>
					+
				</button>

				<button class="join-item btn" onclick={() => gotoPage(customPage)}>
					<Icon data={goIcon}></Icon>
				</button>
			</div>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
