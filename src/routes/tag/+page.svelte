<script lang="ts">
	import { page } from '$app/state';
	import type { PageData } from './$types';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { browseTagURL } from '$lib/routes';

	import LoadingDialog from '$lib/components/LoadingDialog.svelte';
	import Container from '$lib/components/Container.svelte';
	import Content from '$lib/components/Content.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import SideBar from '$lib/components/SideBar.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import MoveToTop from '$lib/components/MoveToTop.svelte';
	import FilterPanel from './FilterPanel.svelte';

	import BottomNav from '$lib/components/BottomNav.svelte';
	import ItemCardGrid from '$lib/components/ItemCardGrid.svelte';
	import { Icon } from 'svelte-icon';
	import filterIcon from '@mdi/svg/svg/filter-menu.svg?raw';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let current_page = $derived(data.request.page);
	let filter = $derived(data.request.filter);
	let items = $derived.by(() =>
		data.response.items.map((tag) => {
			return {
				name: tag.name,
				linkUrl: browseTagURL(page.url, tag.id),
				imageUrl: createThumbnailUrl(tag.id),
				favoriteTag: tag.isFavorite,
				itemCount: tag.pageCount
			};
		})
	);
	let total_page = $derived(data.response.totalPage);
	let order = $derived(data.request.order);
	let sort = $derived(data.request.sort);
	let search = $derived(data.request.search);

	let updated = $state(false);

	let loadingDlg: LoadingDialog;

	$effect(() => {
		if (updated) {
			loadingDlg.close();
		} else {
			loadingDlg.show();
		}
	});

	beforeNavigate(() => (updated = false));
	afterNavigate(() => (updated = true));

	function createThumbnailUrl(id: number) {
		const output = new URL('/api/tag/thumbnail', page.url.origin);
		output.searchParams.append('id', id.toString());

		return output;
	}

	let showMenu = $state(false);

	let filterDialog: HTMLDialogElement;
</script>

<svelte:head>
	<title>Tag List</title>
</svelte:head>

<Container bind:showMenu>
	<Content>
		<NavBar bind:showMenu>
			<div class="text-xl">Tag list</div>
		</NavBar>
		<div class="container mx-auto max-w-5xl">
			<div
				class="bg-base-200 sticky top-16 z-1 mb-4 hidden w-full grid-cols-4 gap-4 p-4 shadow-sm md:grid"
			>
				<FilterPanel {data} bind:search bind:sort bind:order bind:filter />
			</div>
			<div class="bg-base-200 sticky top-16 z-1 flex w-full py-4 md:hidden">
				<div class="flex-1"></div>
				<button class="btn btn-ghost" onclick={() => filterDialog.showModal()}>
					<Icon data={filterIcon} class="fill-slate-400 stroke-slate-800" /> Option
				</button>
			</div>
			<div class="w-full">
				<ItemCardGrid bind:items bind:updated />
			</div>
		</div>
	</Content>

	<SideBar bind:showMenu></SideBar>
</Container>

<Pagination currentPage={current_page} totalPage={total_page} />
<MoveToTop />

<BottomNav currentPage={current_page} totalPage={total_page} />

<LoadingDialog bind:this={loadingDlg} />

<dialog class="modal modal-top" bind:this={filterDialog}>
	<div class="modal-box">
		<div class="text-xl">Option</div>
		<div class="bg-base-100 grid gap-4">
			<FilterPanel {data} bind:search bind:sort bind:order bind:filter />
		</div>
	</div>
	<form method="dialog" class="modal-backdrop h-full w-full">
		<button>close</button>
	</form>
</dialog>
