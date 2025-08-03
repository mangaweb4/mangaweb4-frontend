<script lang="ts">
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import MoveToTop from '$lib/components/MoveToTop.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import { viewURL } from '$lib/routes';

	import type { PageData } from './$types';
	import ItemCard from '$lib/components/ItemCard.svelte';
	import { ITEM_PER_PAGE } from '$lib/constants';
	import LoadingDialog from '$lib/components/LoadingDialog.svelte';
	import PlaceholderCard from '$lib/components/PlaceholderCard.svelte';
	import { Timestamp } from '$lib/grpc/google/protobuf/timestamp';
	import NavBar from '$lib/components/NavBar.svelte';
	import Container from '$lib/components/Container.svelte';
	import Content from '$lib/components/Content.svelte';
	import SideBar from '$lib/components/SideBar.svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let items = $derived(data.response.items);
	let pageIndex = $derived(data.request.page);
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

	function createThumbnailUrl(name: string): URL {
		let u = new URL('/api/manga/thumbnail', page.url.origin);
		u.searchParams.append('name', name);
		return u;
	}

	let showMenu = $state(false);
</script>

<svelte:head>
	<title>History</title>
</svelte:head>

<Container bind:showMenu>
	<Content>
		<NavBar bind:showMenu title="History"></NavBar>

		<div class="container mx-auto prose max-w-[1024px] mt-4">
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				{#if !updated}
					{#each { length: ITEM_PER_PAGE } as _, i}
						<PlaceholderCard accessTime />
					{/each}
				{:else}
					{#each items as item}
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
					{/each}
					{#each { length: ITEM_PER_PAGE - items.length }}
						<ItemCard placeholder={true} />
					{/each}
				{/if}
			</div>
		</div>
		<div style="height: 100px;"></div>
	</Content>
	<SideBar bind:showMenu />
</Container>

<LoadingDialog bind:this={loadingDlg} />

<Pagination currentPage={pageIndex} {totalPage} />
<MoveToTop />
<BottomNav currentPage={pageIndex} {totalPage} />
