<script lang="ts">
	import { Icon } from 'svelte-icon';
	import { page } from '$app/state';

	import moveUpIcon from '@mdi/svg/svg/arrow-up-box.svg?raw';
	import pageIcon from '@mdi/svg/svg/page-next.svg?raw';
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
			<Icon data={pageIcon} class="stroke-slate-800 fill-slate-400" /> Page
		</button>

		<button class="join-item btn btn-active btn-primary">{currentPage}</button>

		<button class="join-item btn" onclick={moveToTop}>
			<Icon data={moveUpIcon} class="stroke-slate-800 fill-slate-400" />
			Top
		</button>
	</div>
</div>

<PaginationDialog bind:this={customInput} {currentPage} {totalPage} {createLink} />
