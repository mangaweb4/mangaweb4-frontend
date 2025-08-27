<script lang="ts">
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
	import { page } from '$app/state';
	import { browseURL, viewURL } from '$lib/routes';
	import type { PageData } from './$types';

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
	import pageCountIcon from '@mdi/svg/svg/book-open-page-variant.svg?raw';
	import searchIcon from '@mdi/svg/svg/magnify.svg?raw';
	import clearIcon from '@mdi/svg/svg/close-circle.svg?raw'

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
				imageUrl: createThumbnailUrl(i.name),
				linkUrl: viewURL(page.url, i.name),
				currentPage: i.currentPage
			};
		})
	);
	let order = $derived(data.request.order);
	let pageIndex = $derived(data.request.page);
	let search = $state(data.request.search);
	let sort = $derived(data.request.sort);

	let totalPage = $derived(data.response.totalPage);

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
			sort: data.request.sort,
			tag: data.request.tag
		};
		if (options != null) {
			const { filter, item_per_page, order, page, search, sort } = options;
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

		return browseURL(page.url.origin, callOptions);
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

	function createThumbnailUrl(name: string): URL {
		const u = new URL('/api/manga/thumbnail', page.url);
		u.searchParams.set('name', name);

		return u;
	}

	let showMenu = $state(false);
</script>

<svelte:head>
	<title>Browse</title>
</svelte:head>

<Container bind:showMenu>
	<Content>
		<NavBar bind:showMenu>
			<div class="text-xl">Browse</div>
		</NavBar>

		<div class="container mx-auto max-w-[1024px] mt-4 mb-24">
			<ItemCardGrid bind:items bind:updated />
		</div>
	</Content>
	<SideBar bind:showMenu>
		<ul class="menu">
			<li class="menu-title">Search</li>
			<li>
				<div class="join gap-0">
					<input class="input join-item" placeholder="title, author" bind:value={search} />
					<button
						class="btn join-item"
						onclick={() => {
							search = '';
							goto(browseURL(page.url.origin));
						}}
					>
						<Icon data={clearIcon} class="fill-slate-400 stroke-slate-800" />
					</button>
					<button
						class="btn join-item"
						onclick={() => goto(browseURL(page.url.origin, { search: search }))}
					>
						<Icon data={searchIcon} class="fill-slate-400 stroke-slate-800" />
					</button>
				</div>
			</li>

			<li class="menu-title">Sort By</li>
			<li>
				<button
					class={sort == SortField.NAME ? 'menu-active' : ''}
					onclick={() => goto(createSortBrowseURL({ sort: SortField.NAME }))}
				>
					<Icon data={nameIcon} class="fill-slate-400 stroke-slate-800" /> Title
				</button>
			</li>

			<li>
				<button
					class={sort == SortField.CREATION_TIME ? 'menu-active' : ''}
					onclick={() => goto(createSortBrowseURL({ sort: SortField.CREATION_TIME }))}
				>
					<Icon data={creationTimeIcon} class="fill-slate-400 stroke-slate-800" /> Creation time
				</button>
			</li>

			<li>
				<button
					class={sort == SortField.PAGECOUNT ? 'menu-active' : ''}
					onclick={() => goto(createSortBrowseURL({ sort: SortField.PAGECOUNT }))}
				>
					<Icon data={pageCountIcon} class="fill-slate-400 stroke-slate-800" /> Page Count
				</button>
			</li>

			<li class="menu-title">Order</li>
			<li>
				<button
					class={order == SortOrder.ASCENDING ? 'menu-active' : ''}
					onclick={() => goto(createSortBrowseURL({ order: SortOrder.ASCENDING }))}
				>
					<Icon data={ascendingIcon} class="fill-slate-400 stroke-slate-800" /> Ascending
				</button>
			</li>

			<li>
				<button
					class={order == SortOrder.DESCENDING ? 'menu-active' : ''}
					onclick={() => goto(createSortBrowseURL({ order: SortOrder.DESCENDING }))}
				>
					<Icon data={descendingIcon} class="fill-slate-400 stroke-slate-800" /> Descending
				</button>
			</li>

			<li class="menu-title">Filter</li>
			<li>
				<button
					class={filter == Filter.UNKNOWN ? 'menu-active' : ''}
					onclick={() => goto(createBrowseURL({ filter: Filter.UNKNOWN }))}
				>
					<Icon data={noneIcon} class="fill-slate-400 stroke-slate-800" /> None
				</button>
			</li>
			<li>
				<button
					class={filter == Filter.FAVORITE_ITEMS ? 'menu-active' : ''}
					onclick={() => goto(createBrowseURL({ filter: Filter.FAVORITE_ITEMS }))}
				>
					<Icon data={favoriteIcon} class="fill-slate-400 stroke-slate-800" /> Favorite items
				</button>
			</li>

			<li>
				<button
					class={filter == Filter.FAVORITE_TAGS ? 'menu-active' : ''}
					onclick={() => goto(createBrowseURL({ filter: Filter.FAVORITE_TAGS }))}
				>
					<Icon data={favoriteTagsIcon} class="fill-slate-400 stroke-slate-800" /> Items with favorite
					tags
				</button>
			</li>
		</ul>
	</SideBar>
</Container>

<LoadingDialog bind:this={loadingDlg} />

<Pagination currentPage={pageIndex} {totalPage} />

<MoveToTop />

<BottomNav currentPage={pageIndex} {totalPage} />

<Toast bind:this={toast} />
