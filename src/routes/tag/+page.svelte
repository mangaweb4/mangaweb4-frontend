<script lang="ts">
	import { page } from '$app/state';
	import ItemCard from '$lib/ItemCard.svelte';
	import type { PageData } from './$types';
	import MoveToTop from '$lib/MoveToTop.svelte';
	import {
		Button,
		Container,
		Icon,
		Input,
		InputGroup,
		Collapse,
		Navbar,
		NavbarToggler,
		NavbarBrand,
		Nav,
		NavItem,
		NavLink,
		Dropdown,
		DropdownToggle,
		DropdownMenu,
		DropdownItem,
		Offcanvas,
		ListGroup,
		ListGroupItem
	} from '@sveltestrap/sveltestrap';
	import Pagination from '$lib/Pagination.svelte';
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
	import { aboutURL, tagURL, browseURL, historyURL, userURL } from '$lib/routes';
	import { ITEM_PER_PAGE } from '$lib/constants';
	import LoadingDialog from '$lib/LoadingDialog.svelte';
	import PlaceholderCard from '$lib/PlaceholderCard.svelte';
	import { Filter, SortField, SortOrder } from '$lib/grpc/types';

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

<Offcanvas toggle={() => (showMenu = !showMenu)} isOpen={showMenu} placement="start" header="Menu">
	<h6>Sort By</h6>
	<ListGroup>
		<ListGroupItem
			tag="button"
			action
			active={sort == SortField.NAME}
			onclick={() => goto(createTagListUrl({ sort: SortField.NAME }))}
		>
			<Icon name="type" class="me-3" /> Name
		</ListGroupItem>

		<ListGroupItem
			tag="button"
			action
			active={sort == SortField.ITEMCOUNT}
			onclick={() => goto(createTagListUrl({ sort: SortField.ITEMCOUNT }))}
		>
			<Icon name="file-earmark" class="me-3" /> Item count
		</ListGroupItem>
	</ListGroup>

	<h6>Order</h6>

	<ListGroup>
		<ListGroupItem
			tag="button"
			action
			active={order == SortOrder.ASCENDING}
			onclick={() => goto(createTagListUrl({ order: SortOrder.ASCENDING }))}
		>
			<Icon name="sort-down-alt" class="me-3" />Ascending
		</ListGroupItem>
		<ListGroupItem
			tag="button"
			action
			active={order == SortOrder.DESCENDING}
			onclick={() => goto(createTagListUrl({ order: SortOrder.DESCENDING }))}
		>
			<Icon name="sort-up-alt" class="me-3" /> Descending
		</ListGroupItem>
	</ListGroup>

	<h6>Filter</h6>
	<ListGroup>
		<ListGroupItem
			tag="button"
			action
			active={filter == Filter.FAVORITE_TAGS}
			onclick={() =>
				goto(
					tagURL(page.url, {
						filter: filter == Filter.FAVORITE_TAGS ? Filter.UNKNOWN : Filter.FAVORITE_TAGS
					})
				)}
		>
			<Icon name="tag-fill" class="me-3" /> Favorite tags
		</ListGroupItem>
	</ListGroup>
	<h6>Search</h6>

	<InputGroup>
		<Input
			type="text"
			bind:value={search}
			onkeyup={(e) => {
				if (e.key == 'Enter') {
					goto(tagURL(page.url.origin, { search: search }));
				}
			}}
		/>
		<Button onclick={() => (search = '')}><Icon name="x" /></Button>
		<Button onclick={() => goto(tagURL(page.url.origin, { search: search }))}>
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
	<NavbarBrand href="/">{`Tag list`}</NavbarBrand>
	<NavbarToggler onclick={() => (navbarToggleOpen = !navbarToggleOpen)} />
	<Collapse isOpen={navbarToggleOpen} navbar expand="md" on:update={handleUpdate}>
		<Nav navbar>
			<Dropdown nav inNavbar>
				<DropdownToggle nav caret>Browse</DropdownToggle>

				<DropdownMenu end>
					<DropdownItem onclick={() => goto(browseURL(page.url.origin))}>
						<Icon name="list-ul" class="me-3" />
						All items
					</DropdownItem>
					<DropdownItem onclick={() => goto(tagURL(page.url.origin))}>
						<Icon name="tags-fill" class="me-3" />
						Tag list
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>
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
	</Collapse>
</Navbar>

<Container fluid style="padding-top:30px;">
	<div class="grid-container">
		<div class="row row-cols-1 row-cols-md-3 row-cols-lg-5 g-3">
			{#if !updated}
				{#each { length: ITEM_PER_PAGE } as _, i}
					<div class="col">
						<PlaceholderCard />
					</div>
				{/each}
			{:else}
				{#each tags as tag}
					<div class="col">
						<ItemCard
							name={tag.name}
							linkUrl={browseURL(page.url, { tag: tag.name })}
							imageUrl={createThumbnailUrl(tag.name)}
							favoriteTag={tag.isFavorite}
							itemCount={tag.pageCount}
						/>
					</div>
				{/each}
				{#each { length: ITEM_PER_PAGE - tags.length } as _, i}
					<div class="col">
						<ItemCard placeholder={true} />
					</div>
				{/each}
			{/if}
		</div>
	</div>
</Container>

{#if !updated}
	<LoadingDialog />
{/if}

<div style="height: 100px;"></div>

<div aria-label="Page navigation" class="position-fixed bottom-0 start-50 p-3 translate-middle-x">
	<Pagination currentPage={current_page} totalPage={total_page} />
</div>

<MoveToTop />
