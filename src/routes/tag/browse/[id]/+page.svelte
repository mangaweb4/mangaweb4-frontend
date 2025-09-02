<script lang="ts">
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
	import { page } from '$app/state';
	import { browseTagURL, browseURL, viewURL } from '$lib/routes';
	import type { PageData } from '../[id]/$types';

	import { Filter, SortField, SortOrder } from '$lib/grpc/types';

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
	import ascendingIcon from '@mdi/svg/svg/sort-ascending.svg?raw';
	import creationTimeIcon from '@mdi/svg/svg/calendar-clock.svg?raw';
	import descendingIcon from '@mdi/svg/svg/sort-descending.svg?raw';
	import favoriteIcon from '@mdi/svg/svg/heart.svg?raw';
	import favoriteTagsIcon from '@mdi/svg/svg/tag-heart.svg?raw';
	import nameIcon from '@mdi/svg/svg/format-title.svg?raw';
	import noneIcon from '@mdi/svg/svg/cancel.svg?raw';
	import pageCountIcon from '@mdi/svg/svg/file-multiple.svg?raw';
	import searchIcon from '@mdi/svg/svg/magnify.svg?raw';
	import isTagFavoriteIcon from '@mdi/svg/svg/tag-heart.svg?raw';
	import isTagNotFavoriteIcon from '@mdi/svg/svg/tag-heart-outline.svg?raw';
	import clearIcon from '@mdi/svg/svg/close-circle.svg?raw';
	import { ITEM_PER_PAGE } from '$lib/constants';

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

	function createBrowseURL(options?: {
		filter?: Filter;
		item_per_page?: number;
		order?: SortOrder;
		page?: number;
		search?: string;
		sort?: SortField;
		tag?: string;
	}): URL {
		let callOptions = {
			user: data.request.user,
			filter: data.request.filter,
			item_per_page: data.request.itemPerPage,
			order: data.request.order,
			page: data.request.page,
			search: data.request.search,
			sort: data.request.sort
		};
		if (options != null) {
			const { filter, item_per_page, order, page, search, sort, tag } = options;
			if (filter != null) {
				callOptions.filter = filter;
			}
			if (item_per_page != null) {
				callOptions.item_per_page = item_per_page;
			}
			if (order != null) {
				callOptions.order = order;
			}
			if (page != null) {
				callOptions.page = page;
			}

			if (search != null) {
				callOptions.search = search;
			}

			if (sort != null) {
				callOptions.sort = sort;
			}
		}

		return browseTagURL(page.url.origin, data.request.id, callOptions);
	}

	function createSortBrowseURL(options: {
		favorite_only?: boolean;
		item_per_page?: number;
		order?: SortOrder;
		page?: number;
		search?: string;
		sort?: SortField;
		tag?: string;
	}): URL {
		const sort = options.sort;
		switch (sort) {
			case SortField.NAME:
				options.order = SortOrder.ASCENDING;
				break;
			case SortField.CREATION_TIME:
				options.order = SortOrder.DESCENDING;
				break;
			case SortField.PAGECOUNT:
				options.order = SortOrder.DESCENDING;
				break;
		}

		return createBrowseURL(options);
	}

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
</script>

<svelte:head>
	<title>Browse Tag: {data.response.name}</title>
</svelte:head>

{#snippet sortFieldTitle(field: SortField)}
	{#if field == SortField.NAME}
		<Icon data={nameIcon} class="fill-slate-400 stroke-slate-800" /> Title
	{:else if field == SortField.CREATION_TIME}
		<Icon data={creationTimeIcon} class="fill-slate-400 stroke-slate-800" /> Creation time
	{:else if field == SortField.PAGECOUNT}
		<Icon data={pageCountIcon} class="fill-slate-400 stroke-slate-800" /> Page Count
	{/if}
{/snippet}

{#snippet orderTitle(order: SortOrder)}
	{#if order == SortOrder.ASCENDING}
		<Icon data={ascendingIcon} class="fill-slate-400 stroke-slate-800" /> Ascending
	{:else if order == SortOrder.DESCENDING}
		<Icon data={descendingIcon} class="fill-slate-400 stroke-slate-800" /> Descending
	{/if}
{/snippet}

{#snippet filterTitle(filter: Filter)}
	{#if filter == Filter.UNKNOWN}
		<Icon data={noneIcon} class="fill-slate-400 stroke-slate-800" /> None
	{:else if filter == Filter.FAVORITE_ITEMS}
		<Icon data={favoriteIcon} class="fill-slate-400 stroke-slate-800" /> Favorite items
	{:else if filter == Filter.FAVORITE_TAGS}
		<Icon data={favoriteTagsIcon} class="fill-slate-400 stroke-slate-800" /> Items with favorite tags
	{/if}
{/snippet}

<Container bind:showMenu>
	<Content>
		<NavBar bind:showMenu>
			<div class="text-xl hidden md:inline">
				<div class="whitespace-nowrap">Browse Tag</div>
			</div>
		</NavBar>
		<div class="container mx-auto max-w-[1024px]">
			<div class="w-full mb-4 shadow-sm p-4 bg-base-100">
				<div class="flex">
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
							<div class="hidden md:inlin">Favorite</div>
						{:else}
							<Icon data={isTagNotFavoriteIcon} class="stroke-slate-800 fill-slate-400"/>
							<div class="hidden md:inlin" >Favorite</div>
						{/if}
					</button>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
					<fieldset class="fieldset w-full">
						<legend class="fieldset-legend">Search</legend>
						<div class="join gap-0 flex">
							<input
								class="input join-item flex-1"
								placeholder="title, author"
								bind:value={search}
							/>
							<button
								class="btn join-item flex-none"
								onclick={() => {
									search = '';
									goto(browseTagURL(page.url.origin, data.request.id));
								}}
							>
								<Icon data={clearIcon} class="fill-slate-400 stroke-slate-800" />
							</button>
							<button
								class="btn join-item flex-none"
								onclick={() =>
									goto(browseTagURL(page.url.origin, data.request.id, { search: search }))}
							>
								<Icon data={searchIcon} class="fill-slate-400 stroke-slate-800" />
							</button>
						</div>
					</fieldset>
					<fieldset class="fieldset w-full">
						<legend class="fieldset-legend">Sort By</legend>
						<details class="dropdown w-full">
							<summary class="btn w-full">{@render sortFieldTitle(data.request.sort)}</summary>
							<ul class="menu dropdown-content bg-base-100 shadow-sm">
								{#each [SortField.NAME, SortField.CREATION_TIME, SortField.PAGECOUNT] as option}
									<li>
										<button
											class:menu-active={sort == option}
											onclick={() => goto(createSortBrowseURL({ sort: option }))}
										>
											{@render sortFieldTitle(option)}
										</button>
									</li>
								{/each}
							</ul>
						</details>
					</fieldset>
					<fieldset class="fieldset w-full">
						<legend class="fieldset-legend">Order</legend>
						<details class="dropdown w-full">
							<summary class="btn w-full">{@render orderTitle(data.request.order)}</summary>
							<ul class="menu dropdown-content bg-base-100 shadow-sm">
								{#each [SortOrder.ASCENDING, SortOrder.DESCENDING] as option}
									<li>
										<button
											class:menu-active={order == option}
											onclick={() => goto(createSortBrowseURL({ order: option }))}
										>
											{@render orderTitle(option)}
										</button>
									</li>
								{/each}
							</ul>
						</details>
					</fieldset>
					<fieldset class="fieldset w-full">
						<legend class="fieldset-legend">Filter</legend>
						<details class="dropdown w-full">
							<summary class="btn w-full">{@render filterTitle(data.request.filter)}</summary>
							<ul class="menu dropdown-content bg-base-100 shadow-sm">
								{#each [Filter.UNKNOWN, Filter.FAVORITE_ITEMS, Filter.FAVORITE_TAGS] as option}
									<li>
										<button
											class:menu-active={filter == option}
											onclick={() => goto(createBrowseURL({ filter: option }))}
										>
											{@render filterTitle(option)}
										</button>
									</li>
								{/each}
							</ul>
						</details>
					</fieldset>
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
