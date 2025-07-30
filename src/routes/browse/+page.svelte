<script lang="ts">
	import { afterNavigate, beforeNavigate, goto, onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import FavoriteButton from '$lib/FavoriteButton.svelte';
	import MoveToTop from '$lib/MoveToTop.svelte';
	import Pagination from '$lib/Pagination.svelte';
	import Toast from '$lib/Toast.svelte';
	import { aboutURL, browseURL, historyURL, tagURL, userURL, viewURL } from '$lib/routes';

	import {
		Button,
		Collapse,
		Dropdown,
		DropdownItem,
		DropdownMenu,
		DropdownToggle,
		Input,
		InputGroup,
		Nav,
		NavItem,
		NavLink,
		Navbar,
		NavbarBrand,
		NavbarToggler
	} from '@sveltestrap/sveltestrap';

	import type { PageData } from './$types';
	import ItemCard from '$lib/components/ItemCard.svelte';
	import { ITEM_PER_PAGE } from '$lib/constants';
	import PlaceholderCard from '$lib/components/PlaceholderCard.svelte';
	import LoadingDialog from '$lib/LoadingDialog.svelte';
	import { Filter, SortField, SortOrder } from '$lib/grpc/types';
	import NavigationMenu from '$lib/components/NavigationMenu.svelte';
	import Container from '$lib/components/Container.svelte';
	import Content from '$lib/components/Content.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import SideBar from '$lib/components/SideBar.svelte';

	import { Icon } from 'svelte-icon';
	import title from '@material-design-icons/svg/round/title.svg?raw';
	import calendar_month from '@material-design-icons/svg/round/calendar_month.svg?raw';
	import insert_drive_file from '@material-design-icons/svg/round/insert_drive_file.svg?raw';
	import sortIcon from '@material-design-icons/svg/round/sort.svg?raw';
	import star from '@material-design-icons/svg/round/star.svg?raw';
	import label from '@material-design-icons/svg/round/label.svg?raw';
	import block from '@material-design-icons/svg/round/block.svg?raw';

	let toast: Toast;

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let filter = $derived(data.request.filter);
	let items = $derived(data.response.items);
	let order = $derived(data.request.order);
	let pageIndex = $derived(data.request.page);
	let search = $state(data.request.search);
	let sort = $derived(data.request.sort);
	let tag = $derived(data.request.tag);
	let tag_favorite = $state(data.response.tagFavorite);

	let totalPage = $derived(data.response.totalPage);

	let updated = $state(false);

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
			if (tag != null) {
				callOptions.tag = tag;
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

	async function onTagFavorite() {
		const url = new URL('/api/tag/set_favorite', page.url.origin);

		url.searchParams.set('name', tag);
		url.searchParams.set('favorite', !tag_favorite ? 'true' : 'false');

		const resp = await fetch(url, { method: 'GET' });
		const json = await resp.json();

		if (json.favorite) {
			toast.show('Favorite', `The tag "${tag}" is now your favorite.`);
		} else {
			toast.show('Favorite', `The tag "${tag}" is no longer your favorite.`);
		}

		tag_favorite = json.favorite;
	}

	let navbarToggleOpen = $state(false);
	function handleUpdate(event: CustomEvent<boolean>) {
		navbarToggleOpen = event.detail;
	}

	function createThumbnailUrl(name: string): URL {
		const u = new URL('/api/manga/thumbnail', page.url);
		u.searchParams.set('name', name);

		return u;
	}

	let showMenu = $state(false);
</script>

<svelte:head>
	<title>Browse: {tag}</title>
</svelte:head>

<Container bind:showMenu>
	<Content>
		<NavBar
			bind:showMenu
			title={data.request.tag == '' ? 'Browse' : `Browse: ${data.request.tag}`}
		/>

		<div class="container mx-auto prose max-w-[1024px] mt-4">
			<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
				{#if !updated}
					{#each { length: ITEM_PER_PAGE } as _}
						<PlaceholderCard />
					{/each}
				{:else}
					{#each items as item}
						<ItemCard
							favorite={item.isFavorite}
							isRead={item.isRead}
							id={item.id}
							name={item.name}
							pageCount={item.pageCount}
							favoriteTag={item.hasFavoriteTag}
							imageUrl={createThumbnailUrl(item.name)}
							linkUrl={viewURL(page.url, item.name)}
							currentPage={item.currentPage}
						/>
					{/each}
					{#each { length: ITEM_PER_PAGE - items.length } as _, i}
						<ItemCard placeholder={true} />
					{/each}
				{/if}
			</div>
		</div>

		{#if !updated}
			<LoadingDialog />
		{/if}

		<div style="height: 100px;"></div>

		<div
			aria-label="Page navigation"
			class="position-fixed bottom-0 start-50 p-3 translate-middle-x"
		>
			<Pagination currentPage={pageIndex} {totalPage} />
		</div>

		<Toast bind:this={toast} />

		<MoveToTop />
	</Content>
	<SideBar bind:showMenu>
		<ul class="menu">
			<li hidden={tag == '' ? true : undefined}>
				<FavoriteButton onclick={() => onTagFavorite()} isFavorite={tag_favorite}>
					Favorite tag
				</FavoriteButton>
			</li>

			<li class="menu-title">Search</li>
			<li>
				<div class="join">
					<input class="input join-item" placeholder="Search" bind:value={search} />
					<button
						class="btn join-item"
						onclick={() => goto(browseURL(page.url.origin, { search: search }))}>Search</button
					>
				</div>
			</li>

			<li class="menu-title">Sort By</li>
			<li>
				<button
					class={sort == SortField.NAME ? 'menu-active' : ''}
					onclick={() => goto(createSortBrowseURL({ sort: SortField.NAME }))}
				>
					<Icon data={title} /> Name
				</button>
			</li>

			<li>
				<button
					class={sort == SortField.CREATION_TIME ? 'menu-active' : ''}
					onclick={() => goto(createSortBrowseURL({ sort: SortField.CREATION_TIME }))}
				>
					<Icon data={calendar_month} /> Create time
				</button>
			</li>

			<li>
				<button
					class={sort == SortField.PAGECOUNT ? 'menu-active' : ''}
					onclick={() => goto(createSortBrowseURL({ sort: SortField.PAGECOUNT }))}
				>
					<Icon data={insert_drive_file} /> Page Count
				</button>
			</li>

			<li class="menu-title">Order</li>
			<li>
				<button
					class={order == SortOrder.ASCENDING ? 'menu-active' : ''}
					onclick={() => goto(createSortBrowseURL({ order: SortOrder.ASCENDING }))}
				>
					<Icon data={sortIcon} /> Ascending
				</button>
			</li>

			<li>
				<button
					class={order == SortOrder.DESCENDING ? 'menu-active' : ''}
					onclick={() => goto(createSortBrowseURL({ order: SortOrder.DESCENDING }))}
				>
					<Icon data={sortIcon} /> Descending
				</button>
			</li>

			<li class="menu-title">Filter</li>
			<li>
				<button
					class={filter == Filter.UNKNOWN ? 'menu-active' : ''}
					onclick={() => goto(createBrowseURL({ filter: Filter.UNKNOWN }))}
				>
					<Icon data={block} /> None
				</button>
			</li>
			<li>
				<button
					class={filter == Filter.FAVORITE_ITEMS ? 'menu-active' : ''}
					onclick={() => goto(createBrowseURL({ filter: Filter.FAVORITE_ITEMS }))}
				>
					<Icon data={star} /> Favorite items
				</button>
			</li>

			<li>
				<button
					class={filter == Filter.FAVORITE_TAGS ? 'menu-active' : ''}
					onclick={() => goto(createBrowseURL({ filter: Filter.FAVORITE_TAGS }))}
				>
					<Icon data={label} /> Items with favorite tags
				</button>
			</li>
		</ul>
	</SideBar>
</Container>
