<script lang="ts">
	import { page } from '$app/state';
	import type { PageData } from './$types';
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
	import { tagURL, browseTagURL } from '$lib/routes';
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
	import itemCountIcon from '@mdi/svg/svg/book-multiple.svg?raw';
	import ascendingIcon from '@mdi/svg/svg/sort-ascending.svg?raw';
	import descendingIcon from '@mdi/svg/svg/sort-descending.svg?raw';
	import favoriteIcon from '@mdi/svg/svg/tag-heart.svg?raw';
	import noneIcon from '@mdi/svg/svg/cancel.svg?raw';
	import lastUpdateIcon from '@mdi/svg/svg/calendar-clock.svg?raw';
	import searchIcon from '@mdi/svg/svg/magnify.svg?raw';
	import clearIcon from '@mdi/svg/svg/close-circle.svg?raw';

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

	function createThumbnailUrl(id: number) {
		const output = new URL('/api/tag/thumbnail', page.url.origin);
		output.searchParams.append('id', id.toString());

		return output;
	}

	interface tagListurlParams {
		filter?: Filter;
		order?: SortOrder;
		sort?: SortField;
		search?: string;
		page?: number;
		item_per_page?: number;
	}

	function createTagListUrl(options?: tagListurlParams) {
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

{#snippet sortFieldTitle(field: SortField)}
	{#if field == SortField.NAME}
		<Icon data={nameIcon} class="fill-slate-400 stroke-slate-800" /> Title
	{:else if field == SortField.ITEMCOUNT}
		<Icon data={itemCountIcon} class="fill-slate-400 stroke-slate-800" /> Item count
	{:else if field == SortField.LAST_UPDATE}
		<Icon data={lastUpdateIcon} class="fill-slate-400 stroke-slate-800" /> Last update
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
	{:else if filter == Filter.FAVORITE_TAGS}
		<Icon data={favoriteIcon} class="fill-slate-400 stroke-slate-800" /> Favorite tags
	{/if}
{/snippet}

<Container bind:showMenu>
	<Content>
		<NavBar bind:showMenu>
			<div class="text-xl">Tag list</div>
		</NavBar>
		<div class="container mx-auto max-w-[1024px]">
			<div class="grid grid-cols-1 md:grid-cols-4 gap-4 w-full mb-4 shadow-sm p-4 bg-base-100">
				<fieldset class="fieldset w-full">
					<legend class="fieldset-legend">Search</legend>
					<div class="join gap-0 flex">
						<input class="input join-item flex-1" placeholder="title, author" bind:value={search} />
						<button
							class="btn join-item flex-none"
							onclick={() => {
								search = '';
								goto(tagURL(page.url.origin));
							}}
						>
							<Icon data={clearIcon} class="fill-slate-400 stroke-slate-800" />
						</button>
						<button
							class="btn join-item flex-none"
							onclick={() => goto(tagURL(page.url.origin, { search: search }))}
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
							{#each [{ sort: SortField.NAME }, { sort: SortField.ITEMCOUNT, order: SortOrder.DESCENDING }, { sort: SortField.LAST_UPDATE, order: SortOrder.DESCENDING }] as option}
								<li>
									<button
										class:menu-active={sort == option.sort}
										onclick={() => goto(createTagListUrl(option))}
									>
										{@render sortFieldTitle(option.sort)}
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
										onclick={() => goto(createTagListUrl({ order: option }))}
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
							{#each [Filter.UNKNOWN, Filter.FAVORITE_TAGS] as option}
								<li>
									<button
										class:menu-active={filter == option}
										onclick={() => goto(tagURL(page.url, { filter: option }))}
									>
										{@render filterTitle(option)}
									</button>
								</li>
							{/each}
						</ul>
					</details>
				</fieldset>
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
