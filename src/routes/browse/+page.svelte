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
		Icon,
		Input,
		InputGroup,
		InputGroupText,
		ListGroup,
		ListGroupItem,
		Nav,
		NavItem,
		NavLink,
		Navbar,
		NavbarBrand,
		NavbarToggler,
		Offcanvas
	} from '@sveltestrap/sveltestrap';

	import type { PageData } from './$types';
	import ItemCard from '$lib/ItemCard.svelte';
	import { ITEM_PER_PAGE } from '$lib/constants';
	import PlaceholderCard from '$lib/PlaceholderCard.svelte';
	import LoadingDialog from '$lib/LoadingDialog.svelte';
	import { Filter, SortField, SortOrder } from '$lib/grpc/types';

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

	function createThumbnailUrl(name: string): URL {
		const u = new URL('/api/manga/thumbnail', page.url);
		u.searchParams.set('name', name);

		return u;
	}

	let showMenu = $state(false);
</script>

<svelte:head>
	<title>Browse {data.request.tag == '' ? 'all items' : `tag: ${data.request.tag}`}</title>
</svelte:head>

<Offcanvas toggle={() => (showMenu = !showMenu)} isOpen={showMenu} placement="start" header="Menu">
	<h6>Sort By</h6>
	<ListGroup>
		<ListGroupItem
			tag="button"
			action
			active={sort == SortField.NAME}
			onclick={() => goto(createSortBrowseURL({ sort: SortField.NAME }))}
		>
			<Icon name="type" class="me-3" /> Name
		</ListGroupItem>
		<ListGroupItem
			tag="button"
			action
			active={sort == SortField.CREATION_TIME}
			onclick={() => goto(createSortBrowseURL({ sort: SortField.CREATION_TIME }))}
		>
			<Icon name="clock" class="me-3" /> Create time
		</ListGroupItem>
		<ListGroupItem
			tag="button"
			action
			active={sort == SortField.PAGECOUNT}
			onclick={() => goto(createSortBrowseURL({ sort: SortField.PAGECOUNT }))}
		>
			<Icon name="file-earmark" class="me-3" /> Page count
		</ListGroupItem>
	</ListGroup>

	<h6>Order</h6>

	<ListGroup>
		<ListGroupItem
			tag="button"
			action
			active={order == SortOrder.ASCENDING}
			onclick={() => goto(createBrowseURL({ order: SortOrder.ASCENDING }))}
		>
			<Icon name="sort-down-alt" class="me-3" />Ascending
		</ListGroupItem>
		<ListGroupItem
			tag="button"
			action
			active={order == SortOrder.DESCENDING}
			onclick={() => goto(createBrowseURL({ order: SortOrder.DESCENDING }))}
		>
			<Icon name="sort-up-alt" class="me-3" /> Descending
		</ListGroupItem>
	</ListGroup>

	<h6>Filter</h6>
	<ListGroup>
		<ListGroupItem
			tag="button"
			action
			active={filter == Filter.FAVORITE_ITEMS}
			onclick={() => goto(createBrowseURL({ filter: Filter.FAVORITE_ITEMS }))}
		>
			<Icon name="star" class="me-3" /> Favorite items
		</ListGroupItem>
		<ListGroupItem
			tag="button"
			action
			active={filter == Filter.FAVORITE_TAGS}
			disabled={tag != ''}
			onclick={() => goto(createBrowseURL({ filter: Filter.FAVORITE_TAGS }))}
		>
			<Icon name="tag-fill" class="me-3" /> Items with favorite tags
		</ListGroupItem>
	</ListGroup>
	<h6>Search</h6>

	<InputGroup>
		<Input
			type="text"
			bind:value={search}
			onkeyup={(e) => {
				if (e.key == 'Enter') {
					goto(browseURL(page.url.origin, { search: search }));
				}
			}}
		/>
		<Button onclick={() => (search = '')}><Icon name="x" /></Button>
		<Button onclick={() => goto(browseURL(page.url.origin, { search: search }))}>
			<Icon name="search" />
		</Button>
	</InputGroup>

	<h6>Navigation</h6>
	<Nav vertical>
		<NavItem>
			<NavLink onclick={() => goto(browseURL(page.url.origin))}>
				<Icon name="list-ul" class="me-3" /> &nbsp;All items
			</NavLink>
		</NavItem>
		<NavItem>
			<NavLink onclick={() => goto(tagURL(page.url.origin))}>
				<Icon name="tags-fill" class="me-3" />&nbsp;Tag list
			</NavLink>
		</NavItem>

		<NavItem>
			<NavLink onclick={() => goto(historyURL(page.url.origin))}>History</NavLink>
		</NavItem>
		<NavItem>
			<NavLink onclick={() => goto(userURL(page.url.origin))}>User</NavLink>
		</NavItem>
		<NavItem>
			<NavLink onclick={() => goto(aboutURL(page.url.origin))}>About</NavLink>
		</NavItem>
	</Nav>
</Offcanvas>

<Navbar color="dark" dark expand="md" sticky={'top'}>
	<Nav navbar class="me-3">
		<Button class="border" onclick={() => (showMenu = true)}>
			<Icon name="list" />
		</Button>
	</Nav>

	<NavbarBrand>
		{data.request.tag == '' ? 'Browse all items' : `Browse tag: ${data.request.tag}`}
	</NavbarBrand>

	<Nav class="ms-auto" navbar>
		<NavItem hidden={tag == '' ? true : undefined}>
			<FavoriteButton onclick={() => onTagFavorite()} isFavorite={tag_favorite}>
				<span class="d-none d-md-block">&nbsp;Favorite</span>
			</FavoriteButton>
		</NavItem>
	</Nav>
</Navbar>

<div class="container-fluid" style="padding-top:30px;">
	<div class="grid-container">
		<div class="row row-cols-1 row-cols-md-3 row-cols-lg-5 g-3">
			{#if !updated}
				{#each { length: ITEM_PER_PAGE } as _}
					<div class="col">
						<PlaceholderCard />
					</div>
				{/each}
			{:else}
				{#each items as item}
					<div class="col">
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
					</div>
				{/each}
				{#each { length: ITEM_PER_PAGE - items.length } as _, i}
					<div class="col">
						<ItemCard placeholder={true} />
					</div>
				{/each}
			{/if}
		</div>
	</div>
</div>

{#if !updated}
	<LoadingDialog />
{/if}

<div style="height: 100px;"></div>

<div aria-label="Page navigation" class="position-fixed bottom-0 start-50 p-3 translate-middle-x">
	<Pagination currentPage={pageIndex} {totalPage} />
</div>

<Toast bind:this={toast} />

<MoveToTop />
