<script lang="ts">
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { viewURL } from '$lib/routes';
	import type { PageData } from '../[id]/$types';

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
	import isTagFavoriteIcon from '@mdi/svg/svg/tag-heart.svg?raw';
	import isTagNotFavoriteIcon from '@mdi/svg/svg/tag-heart-outline.svg?raw';
	import filterIcon from '@mdi/svg/svg/filter-menu.svg?raw';
	import { ITEM_PER_PAGE } from '$lib/constants';
	import FilterPanel from './FilterPanel.svelte';

	let toast: Toast;

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let { order, page: pageIndex, search, sort, filter } = $derived(data.request);

	let favoriteTag = $state(data.response.tagFavorite);
	let totalPage = $derived(Math.ceil(data.response.totalItemCount / ITEM_PER_PAGE));

	let items = $derived.by(() =>
		data.response.items.map((i) => {
			return {
				favorite: i.isFavorite,
				isRead: i.isRead,
				id: i.id,
				name: i.name,
				pageCount: i.pageCount,
				favoriteTag: i.hasFavoriteTag || favoriteTag,
				imageUrl: createThumbnailUrl(i.id),
				linkUrl: viewURL(page.url, i.id),
				currentPage: i.currentPage
			};
		})
	);

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

	async function onTagFavorite() {
		const url = new URL('/api/tag/set_favorite', page.url.origin);

		url.searchParams.set('id', data.request.id.toString());
		url.searchParams.set('favorite', !favoriteTag ? 'true' : 'false');

		const resp = await fetch(url, { method: 'GET' });
		const json = await resp.json();

		if (json.favorite) {
			toast.add(`The tag "${data.response.name}" is now your favorite.`, 'success');
		} else {
			toast.add(`The tag "${data.response.name}" is no longer your favorite.`, 'success');
		}

		favoriteTag = json.favorite;
	}

	function createThumbnailUrl(id: number): URL {
		const u = new URL('/api/manga/thumbnail', page.url);
		u.searchParams.set('id', id.toString());

		return u;
	}

	let showMenu = $state(false);
	let filterDialog: HTMLDialogElement;
</script>

<svelte:head>
	<title>Browse Tag: {data.response.name}</title>
</svelte:head>

<Container bind:showMenu>
	<Content>
		<NavBar bind:showMenu>
			<div class="text-xl">
				<div class="whitespace-nowrap">Browse Tag</div>
			</div>
		</NavBar>
		<div class="container mx-auto max-w-[1024px]">
			<div class="w-full mb-4 shadow-sm p-4 bg-base-200 top-16 sticky w-full z-1">
				<div class="flex mb-2">
					<div class="flex-1 text-xl">
						{data.response.name}
					</div>
					<button
						class="flex-none btn btn-ghost"
						class:bg-purple-200={favoriteTag}
						class:text-purple-800={favoriteTag}
						onclick={() => onTagFavorite()}
					>
						{#if favoriteTag}
							<Icon data={isTagFavoriteIcon} class="stroke-purple-800 fill-purple-400" />
							Favorite
						{:else}
							<Icon data={isTagNotFavoriteIcon} class="stroke-slate-800 fill-slate-400" />
							Favorite
						{/if}
					</button>
				</div>
				<div class="md:hidden flex">
					<div class="flex-1"></div>
					<button class="btn btn-ghost" onclick={() => filterDialog.showModal()}>
						<Icon data={filterIcon} class="fill-slate-400 stroke-slate-800"/> Option
					</button>
				</div>

				<div class="hidden md:grid grid-cols-4 gap-4">
					<FilterPanel {data} bind:search bind:sort bind:order bind:filter />
				</div>
			</div>
			<div class="w-full">
				<ItemCardGrid bind:items bind:updated />
			</div>
		</div>
	</Content>
	<SideBar bind:showMenu></SideBar>
</Container>

<LoadingDialog bind:this={loadingDlg} />

<Pagination currentPage={pageIndex} {totalPage} />

<MoveToTop />

<BottomNav currentPage={pageIndex} {totalPage} />

<Toast bind:this={toast} />

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
