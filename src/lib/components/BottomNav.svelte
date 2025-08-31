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
	import plusIcon from '@mdi/svg/svg/plus.svg?raw';
	import minusIcon from '@mdi/svg/svg/minus.svg?raw';
	import PaginationDialog from './PaginationDialog.svelte';

	function moveToTop() {
		location.hash = '#top';
		location.hash = '';
	}

	interface Props {
		currentPage?: number;
		totalPage?: number;
	}

	let { currentPage = 0, totalPage = 1 }: Props = $props();

	function gotoPage(i: number) {
		goto(createLink(i));
	}

	function createLink(i: number): URL {
		let url = new URL(page.url);
		url.searchParams.set('page', i.toString());

		return url;
	}

	let customInput: PaginationDialog;
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

<PaginationDialog bind:this={customInput} bind:currentPage {totalPage} {createLink} />
