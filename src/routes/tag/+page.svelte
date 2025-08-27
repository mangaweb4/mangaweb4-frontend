<script lang="ts">
	import { page } from '$app/state';
	import type { PageData } from './$types';
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
	import { tagURL, browseURL, browseTagURL } from '$lib/routes';
	import { Filter, SortField, SortOrder } from '$lib/grpc/types';

	import LoadingDialog from '$lib/components/LoadingDialog.svelte';
	import Container from '$lib/components/Container.svelte';
	import Content from '$lib/components/Content.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import SideBar from '$lib/components/SideBar.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import MoveToTop from '$lib/components/MoveToTop.svelte';

	import { Icon } from 'svelte-icon';
	import nameIcon from '@mdi/svg/svg/format-title.svg?raw';
	import itemCountIcon from '@mdi/svg/svg/file-multiple.svg?raw';
	import ascendingIcon from '@mdi/svg/svg/sort-ascending.svg?raw';
	import descendingIcon from '@mdi/svg/svg/sort-descending.svg?raw';
	import favoriteIcon from '@mdi/svg/svg/file-star.svg?raw';
	import noneIcon from '@mdi/svg/svg/cancel.svg?raw';
	import lastUpdateIcon from '@mdi/svg/svg/calendar-clock.svg?raw';

	import BottomNav from '$lib/components/BottomNav.svelte';
	import ItemCardGrid from '$lib/components/ItemCardGrid.svelte';

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
				linkUrl: browseTagURL(page.url, tag.name),
				imageUrl: createThumbnailUrl(tag.name),
				favoriteTag: tag.isFavorite,
				itemCount: tag.pageCount
			};
		})
	);
	let total_page = $derived(data.response.totalPage);
	let order = $derived(data.request.order);
	let sort = $derived(data.request.sort);
	let search = $state(data.request.search);

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

	function createThumbnailUrl(name: string) {
		const output = new URL('/api/tag/thumbnail', page.url.origin);
		output.searchParams.append('name', name);

		return output;
	}

	function createTagListUrl(options?: {
		filter?: Filter.UNKNOWN | Filter.FAVORITE_TAGS;
		order?: SortOrder;
		sort?: SortField.NAME | SortField.ITEMCOUNT | SortField.LAST_UPDATE;
		search?: string;
		page?: number;
		item_per_page?: number;
	}) {
		let callOptions = { ...data.request };
		if (options != null) {
			const { item_per_page, order, page, search, sort } = options;

			if (item_per_page != null) {
				callOptions.itemPerPage = item_per_page;
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
				// If 'sort' is provided, override the 'order' value based on the sort selection.
				// Preserve the custom 'order' if one was explicitly provided in the options.
				switch (sort) {
					case SortField.NAME:
						callOptions.order = callOptions.order ?? 'ascending';
						break;

					case SortField.ITEMCOUNT:
						callOptions.order = callOptions.order ?? 'descending';
						break;
				}
			}
		}

		if (callOptions.filter != Filter.UNKNOWN && callOptions.filter != Filter.FAVORITE_TAGS) {
			return '';
		}

		return tagURL(page.url.origin, { ...callOptions });
	}

	let showMenu = $state(false);
</script>

<svelte:head>
	<title>Tag List</title>
</svelte:head>

<Container bind:showMenu>
	<Content>
		<NavBar bind:showMenu title="Tag List" />

		<div class="container mx-auto max-w-[1024px] mt-4 mb-24">
			<ItemCardGrid bind:items bind:updated accessTime={true} />
		</div>
	</Content>

	<SideBar bind:showMenu>
		<ul class="menu">
			<li class="menu-title">Search</li>
			<li>
				<div class="join gap-0">
					<input class="input join-item" placeholder="Search" bind:value={search} />
					<button
						class="btn join-item"
						onclick={() => goto(tagURL(page.url.origin, { search: search }))}>Search</button
					>
				</div>
			</li>

			<li class="menu-title">Sort By</li>
			<li>
				<button
					class={sort == SortField.NAME ? 'menu-active' : ''}
					onclick={() => goto(createTagListUrl({ sort: SortField.NAME }))}
				>
					<Icon data={nameIcon} class="fill-slate-400 stroke-slate-800" /> Name
				</button>
			</li>

			<li>
				<button
					class={sort == SortField.PAGECOUNT ? 'menu-active' : ''}
					onclick={() =>
						goto(createTagListUrl({ sort: SortField.ITEMCOUNT, order: SortOrder.DESCENDING }))}
				>
					<Icon data={itemCountIcon} class="fill-slate-400 stroke-slate-800" /> Item count
				</button>
			</li>

			<li>
				<button
					class={sort == SortField.LAST_UPDATE ? 'menu-active' : ''}
					onclick={() =>
						goto(createTagListUrl({ sort: SortField.LAST_UPDATE, order: SortOrder.DESCENDING }))}
				>
					<Icon data={lastUpdateIcon} class="fill-slate-400 stroke-slate-800" /> Last update
				</button>
			</li>

			<li class="menu-title">Order</li>
			<li>
				<button
					class={order == SortOrder.ASCENDING ? 'menu-active' : ''}
					onclick={() => goto(createTagListUrl({ order: SortOrder.ASCENDING }))}
				>
					<Icon data={ascendingIcon} class="fill-slate-400 stroke-slate-800" /> Ascending
				</button>
			</li>

			<li>
				<button
					class={order == SortOrder.DESCENDING ? 'menu-active' : ''}
					onclick={() => goto(createTagListUrl({ order: SortOrder.DESCENDING }))}
				>
					<Icon data={descendingIcon} class="fill-slate-400 stroke-slate-800" /> Descending
				</button>
			</li>

			<li class="menu-title">Filter</li>
			<li>
				<button
					class={filter == Filter.UNKNOWN ? 'menu-active' : ''}
					onclick={() => goto(tagURL(page.url, { filter: Filter.UNKNOWN }))}
				>
					<Icon data={noneIcon} class="fill-slate-400 stroke-slate-800" /> None
				</button>
			</li>

			<li>
				<button
					class={filter == Filter.FAVORITE_TAGS ? 'menu-active' : ''}
					onclick={() => goto(tagURL(page.url, { filter: Filter.FAVORITE_TAGS }))}
				>
					<Icon data={favoriteIcon} class="fill-slate-400 stroke-slate-800" /> Favorite tags
				</button>
			</li>
		</ul>
	</SideBar>
</Container>

<Pagination currentPage={current_page} totalPage={total_page} />
<MoveToTop />

<BottomNav currentPage={current_page} totalPage={total_page} />

<LoadingDialog bind:this={loadingDlg} />
