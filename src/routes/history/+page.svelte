<script lang="ts">
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
	import { page } from '$app/state';
	import MoveToTop from '$lib/MoveToTop.svelte';
	import Pagination from '$lib/Pagination.svelte';
	import { aboutURL, browseURL, historyURL, tagURL, userURL, viewURL } from '$lib/routes';

	import {
		Collapse,
		Dropdown,
		DropdownItem,
		DropdownMenu,
		DropdownToggle,
		Icon,
		Nav,
		NavItem,
		NavLink,
		Navbar,
		NavbarBrand,
		NavbarToggler
	} from '@sveltestrap/sveltestrap';
	import type { PageData } from './$types';
	import ItemCard from '$lib/ItemCard.svelte';
	import { ITEM_PER_PAGE } from '$lib/constants';
	import LoadingDialog from '$lib/LoadingDialog.svelte';
	import PlaceholderCard from '$lib/PlaceholderCard.svelte';
	import { Timestamp } from '$lib/grpc/google/protobuf/timestamp';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let items = $derived(data.response.items);
	let pageIndex = $derived(data.request.page);
	let totalPage = $derived(data.response.totalPage);
	let navbarToggleOpen = $state(false);

	let updated = $state(false);

	beforeNavigate(() => (updated = false));
	afterNavigate(() => (updated = true));

	function handleUpdate(event: CustomEvent<boolean>) {
		navbarToggleOpen = event.detail;
	}

	function createThumbnailUrl(name: string): URL {
		let u = new URL('/api/manga/thumbnail', page.url.origin);
		u.searchParams.append('name', name);
		return u;
	}
</script>

<svelte:head>
	<title>History</title>
</svelte:head>

<Navbar color="dark" dark expand="md" sticky={'top'}>
	<NavbarBrand href="/">History</NavbarBrand>

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

<div class="container-fluid" style="padding-top:30px;">
	<div class="grid-container">
		<div class="row row-cols-1 row-cols-md-3 row-cols-lg-5 g-3">
			{#if !updated}
				{#each { length: ITEM_PER_PAGE } as _, i}
					<div class="col">
						<PlaceholderCard accessTime />
					</div>
				{/each}
			{:else}
				{#each items as item}
					<div class="col">
						<ItemCard
							favorite={item.isFavorite}
							favoriteTag={item.hasFavoriteTag}
							isRead={item.isRead}
							id={item.id}
							name={item.name}
							pageCount={item.pageCount}
							linkUrl={viewURL(page.url, item.name)}
							imageUrl={createThumbnailUrl(item.name)}
							accessTime={item.accessTime ? Timestamp.toDate(item.accessTime) : new Date()}
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
<div style="height: 100px;"></div>

{#if !updated}
	<LoadingDialog />
{/if}

<div aria-label="Page navigation" class="position-fixed bottom-0 start-50 p-3 translate-middle-x">
	<Pagination currentPage={pageIndex} {totalPage} />
</div>

<MoveToTop />
