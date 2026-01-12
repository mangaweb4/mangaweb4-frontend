<script lang="ts">
	import { ITEM_PER_PAGE } from '$lib/constants';
	import ItemCard from './ItemCard.svelte';
	import PlaceholderCard from './PlaceholderCard.svelte';

	interface Item {
		favorite?: boolean;
		isRead?: boolean;
		favoriteTag?: boolean;
		id?: string | number;
		name?: string;
		pageCount?: number;
		itemCount?: number;
		linkUrl?: string | URL;
		imageUrl?: string | URL;
		accessTime?: number | boolean | string | Date;
		dummy?: boolean;
		currentPage?: number;
	}

	let {
		updated = $bindable(false),
		items = $bindable([] as Item[]),
		accessTime = false
	} = $props();
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
	{#if !updated}
		{#each { length: ITEM_PER_PAGE } as _}
			<PlaceholderCard />
		{/each}
	{:else}
		{#each items as item}
			<ItemCard
				favorite={item.favorite}
				isRead={item.isRead}
				favoriteTag={item.favoriteTag}
				id={item.id}
				name={item.name}
				pageCount={item.pageCount}
				itemCount={item.itemCount}
				linkUrl={item.linkUrl}
				imageUrl={item.imageUrl}
				accessTime={item.accessTime}
				dummy={item.dummy}
				currentPage={item.currentPage}
			/>
		{/each}
		{#each { length: ITEM_PER_PAGE - items.length }}
			<ItemCard dummy={true} accessTime={accessTime == true} />
		{/each}
	{/if}
</div>
