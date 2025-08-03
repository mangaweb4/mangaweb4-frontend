<script lang="ts">
	import { page } from '$app/state';

	import { Icon } from 'svelte-icon';
	import firstPageIcon from '@mdi/svg/svg/page-first.svg?raw';
	import lastPageIcon from '@mdi/svg/svg/page-last.svg?raw';
	import goIcon from '@mdi/svg/svg/arrow-right-circle.svg?raw';
	import customPageIcon from '@mdi/svg/svg/dots-vertical.svg?raw';
	import { goto } from '$app/navigation';

	interface Props {
		currentPage?: number;
		totalPage?: number;
		pageToShow?: number;
	}

	let { currentPage = 0, totalPage = 1, pageToShow = 5 }: Props = $props();

	let first = $derived.by(() => Math.max(0, currentPage - Math.floor(pageToShow / 2)));
	let last = $derived.by(() => Math.min(totalPage - 1, first + pageToShow - 1));

	let pageNumbers: number[] = $derived.by(() =>
		Array.from({ length: last - first + 1 }, (_, i) => first + i)
	);

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

<div class="fixed bottom-10 inset-x-1/2 hidden md:flex">
	<div class="join shadow-xl -translate-x-1/2">
		<button class="join-item btn" onclick={() => goto(createLink(first).toString())}>
			<Icon data={firstPageIcon} />
		</button>

		{#each pageNumbers as i}
			<button
				class="join-item btn {currentPage === i ? 'btn-active' : undefined}"
				onclick={() => goto(createLink(i).toString())}
			>
				{i}
			</button>
		{/each}

		<button class="join-item btn" onclick={() => customInput.showModal()}>
			<Icon data={customPageIcon} />
		</button>

		<button class="join-item btn" onclick={() => goto(createLink(last).toString())}>
			<Icon data={lastPageIcon} />
		</button>
	</div>
</div>

<dialog class="modal modal-bottom" bind:this={customInput}>
	<div class="modal-box w-full max-w-[640px] mx-auto">
		<h3 class="text-lg font-bold">Move to page</h3>
		<div class="py-4">
			<div class="join w-full">
				<button class="join-item btn" onclick={() => (customPage = 0)}>0</button>
				<input
					type="number"
					class="input join-item"
					bind:value={customPage}
					placeholder="page #"
					max={totalPage - 1}
					min={0}
				/>
				<button class="join-item btn" onclick={() => (customPage = totalPage - 1)}
					>{totalPage - 1}</button
				>
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
