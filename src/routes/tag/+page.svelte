<script lang="ts">
	import { page } from '$app/state';
	import ItemCard from '$lib/components/ItemCard.svelte';
	import type { PageData } from './$types';
	import MoveToTop from '$lib/components/MoveToTop.svelte';
	
	import Pagination from '$lib/components/Pagination.svelte';
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
	import { tagURL, browseURL } from '$lib/routes';
	import { ITEM_PER_PAGE } from '$lib/constants';
	import LoadingDialog from '$lib/LoadingDialog.svelte';
	import PlaceholderCard from '$lib/components/PlaceholderCard.svelte';
	import { Filter, SortField, SortOrder } from '$lib/grpc/types';
	import Container from '$lib/components/Container.svelte';
	import Content from '$lib/components/Content.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import SideBar from '$lib/components/SideBar.svelte';

	import { Icon } from 'svelte-icon';
	import title from '@mdi/svg/svg/format-title.svg?raw';
	import file_multiple from '@mdi/svg/svg/file-multiple.svg?raw';
	import sortAscending from '@mdi/svg/svg/sort-ascending.svg?raw';
	import sortDescending from '@mdi/svg/svg/sort-descending.svg?raw';
	import fileStar from '@mdi/svg/svg/file-star.svg?raw';
	import cancel from '@mdi/svg/svg/cancel.svg?raw';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let current_page = $derived(data.request.page);
	let filter = $derived(data.request.filter);
	let tags = $derived(data.response.items);
	let total_page = $derived(data.response.totalPage);

	let order = $derived(data.request.order);
	let sort = $derived(data.request.sort);

	let search = $state(data.request.search);

	let navbarToggleOpen = $state(false);

	let updated = $state(false);

	beforeNavigate(() => (updated = false));
	afterNavigate(() => (updated = true));

	function handleUpdate(event: CustomEvent<boolean>) {
		navbarToggleOpen = event.detail;
	}

	function createThumbnailUrl(name: string) {
		const output = new URL('/api/tag/thumbnail', page.url.origin);
		output.searchParams.append('name', name);

		return output;
	}

	function createTagListUrl(options?: {
		filter?: Filter.UNKNOWN | Filter.FAVORITE_TAGS;
		order?: SortOrder;
		sort?: SortField.NAME | SortField.ITEMCOUNT;
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

		<div class="container mx-auto prose max-w-[1024px] mt-4">
			<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
				{#if !updated}
					{#each { length: ITEM_PER_PAGE } as _, i}
						<PlaceholderCard />
					{/each}
				{:else}
					{#each tags as tag}
						<ItemCard
							name={tag.name}
							linkUrl={browseURL(page.url, { tag: tag.name })}
							imageUrl={createThumbnailUrl(tag.name)}
							favoriteTag={tag.isFavorite}
							itemCount={tag.pageCount}
						/>
					{/each}
					{#each { length: ITEM_PER_PAGE - tags.length } as _, i}
						<ItemCard placeholder={true} />
					{/each}
				{/if}
			</div>
		</div>
	</Content>

	<SideBar bind:showMenu>
		<ul class="menu">
			<li class="menu-title">Search</li>
			<li>
				<div class="join">
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
					<Icon data={title} /> Name
				</button>
			</li>

			<li>
				<button
					class={sort == SortField.PAGECOUNT ? 'menu-active' : ''}
					onclick={() => goto(createTagListUrl({ sort: SortField.ITEMCOUNT }))}
				>
					<Icon data={file_multiple} /> Item count
				</button>
			</li>

			<li class="menu-title">Order</li>
			<li>
				<button
					class={order == SortOrder.ASCENDING ? 'menu-active' : ''}
					onclick={() => goto(createTagListUrl({ order: SortOrder.ASCENDING }))}
				>
					<Icon data={sortAscending} /> Ascending
				</button>
			</li>

			<li>
				<button
					class={order == SortOrder.DESCENDING ? 'menu-active' : ''}
					onclick={() => goto(createTagListUrl({ order: SortOrder.DESCENDING }))}
				>
					<Icon data={sortDescending} /> Descending
				</button>
			</li>

			<li class="menu-title">Filter</li>
			<li>
				<button
					class={filter == Filter.UNKNOWN ? 'menu-active' : ''}
					onclick={() => goto(tagURL(page.url, { filter: Filter.UNKNOWN }))}
				>
					<Icon data={cancel} /> None
				</button>
			</li>

			<li>
				<button
					class={filter == Filter.FAVORITE_TAGS ? 'menu-active' : ''}
					onclick={() => goto(tagURL(page.url, { filter: Filter.FAVORITE_TAGS }))}
				>
					<Icon data={fileStar} /> Favorite tags
				</button>
			</li>
		</ul>
	</SideBar>
</Container>

{#if !updated}
	<LoadingDialog />
{/if}

<div style="height: 100px;"></div>

<div aria-label="Page navigation" class="position-fixed bottom-0 start-50 p-3 translate-middle-x">
	<Pagination currentPage={current_page} totalPage={total_page} />
</div>

<MoveToTop />
