<script lang="ts">
	import { page } from '$app/state';

	import { Icon } from 'svelte-icon';
	import firstPageIcon from '@mdi/svg/svg/page-first.svg?raw';
	import lastPageIcon from '@mdi/svg/svg/page-last.svg?raw';
	import customPageIcon from '@mdi/svg/svg/dots-vertical.svg?raw';
	import { goto } from '$app/navigation';
	import PaginationDialog from './PaginationDialog.svelte';

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

	let customInput: PaginationDialog;

	function createLink(i: number): URL {
		let url = new URL(page.url);
		url.searchParams.set('page', i.toString());

		return url;
	}
</script>

<div class="fixed bottom-10 inset-x-1/2 hidden md:flex">
	<div class="join shadow-xl -translate-x-1/2">
		<button class="join-item btn" onclick={() => goto(createLink(0))}>
			<Icon data={firstPageIcon} />
		</button>

		{#each pageNumbers as i}
			<button
				class="join-item btn"
				class:btn-active={currentPage == i}
				class:btn-primary={currentPage == i}
				onclick={() => goto(createLink(i))}
			>
				{i}
			</button>
		{/each}

		<button class="join-item btn" onclick={() => customInput.showModal()}>
			<Icon data={customPageIcon} />
		</button>

		<button class="join-item btn" onclick={() => goto(createLink(totalPage - 1).toString())}>
			<Icon data={lastPageIcon} />
		</button>
	</div>
</div>

<PaginationDialog bind:this={customInput} {currentPage} {totalPage} {createLink} />
