<script lang="ts">
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { viewURL } from '$lib/routes';
	import type { PageData } from './$types';
	import { bindKey } from '@rwh/keystrokes';
	import { onMount } from 'svelte';
	import { MediaQuery } from 'svelte/reactivity';

	import Container from '$lib/components/Container.svelte';
	import Content from '$lib/components/Content.svelte';
	import LoadingDialog from '$lib/components/LoadingDialog.svelte';
	import MoveToTop from '$lib/components/MoveToTop.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import SideBar from '$lib/components/SideBar.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import ItemCardGrid from '$lib/components/ItemCardGrid.svelte';

	import { Icon } from 'svelte-icon';
	import filterIcon from '@mdi/svg/svg/filter-menu.svg?raw';
	import FilterPanel from './FilterPanel.svelte';

	let toast: Toast;

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let filter = $derived(data.request.filter);
	let items = $derived.by(() =>
		data.response.items.map((i) => {
			return {
				favorite: i.isFavorite,
				isRead: i.isRead,
				id: i.id,
				name: i.name,
				pageCount: i.pageCount,
				favoriteTag: i.hasFavoriteTag,
				imageUrl: createThumbnailUrl(i.id),
				linkUrl: viewURL(page.url, i.id),
				currentPage: i.currentPage
			};
		})
	);
	let order = $derived(data.request.order);
	let pageIndex = $derived(data.request.page);
	let search = $state(data.request.search);
	let sort = $derived(data.request.sort);

	let totalPage = $derived(data.response.totalPage);

	let updated = $derived(data != undefined && data != null);
	let loadingDlg: LoadingDialog;

	const prefersReducedMotion = new MediaQuery('prefers-reduced-motion');

	$effect(() => {
		if (updated) {
			loadingDlg.close();
		} else {
			loadingDlg.show();
		}
	});

	onMount(() => {
		if (prefersReducedMotion.current) {
			bindKey(['ArrowUp', 'PageUp'], (e) => {
				e.preventDefault();
				window.scrollBy(0, -250);
			});
			bindKey(['ArrowDown', 'PageDown'], (e) => {
				e.preventDefault();
				window.scrollBy(0, 250);
			});
		}
	});

	beforeNavigate(() => (updated = false));
	afterNavigate(() => (updated = true));

	function createThumbnailUrl(id: number): URL {
		const u = new URL('/api/manga/thumbnail', page.url);
		u.searchParams.set('id', id.toString());

		return u;
	}

	let showMenu = $state(false);

	let filterDialog: HTMLDialogElement;
</script>

<svelte:head>
	<title>Browse</title>
</svelte:head>

<Container bind:showMenu>
	<Content>
		<NavBar bind:showMenu rootPage={true}>
			<div class="text-xl">Browse</div>
		</NavBar>

		<div class="container mx-auto max-w-[1024px]">
			<div class="md:hidden bg-base-200 flex py-4 top-16 sticky w-full z-1">
				<div class="flex-1"></div>
				<button class="btn btn-ghost" onclick={() => filterDialog.showModal()}>
					<Icon data={filterIcon} class="fill-slate-400 stroke-slate-800" /> Option
				</button>
			</div>
			<div
				class="hidden md:grid md:grid-cols-4 gap-4 w-full mb-4 shadow-sm p-4 bg-base-200 top-16 sticky w-full z-1"
			>
				<FilterPanel {data} bind:search bind:sort bind:order bind:filter />
			</div>
			<div class="w-full">
				<ItemCardGrid bind:items bind:updated />
			</div>
		</div>
	</Content>
	<SideBar bind:showMenu></SideBar>
</Container>

<dialog class="modal modal-top" bind:this={filterDialog}>
	<div class="modal-box">
		<div class="text-xl">Option</div>
		<div class="grid gap-4 bg-base-100">
			<FilterPanel {data} bind:search bind:sort bind:order bind:filter />
		</div>
	</div>
	<form method="dialog" class="modal-backdrop w-full h-full">
		<button>close</button>
	</form>
</dialog>

<LoadingDialog bind:this={loadingDlg} />

<Pagination currentPage={pageIndex} {totalPage} />

<MoveToTop />

<BottomNav currentPage={pageIndex} {totalPage} />

<Toast bind:this={toast} />
