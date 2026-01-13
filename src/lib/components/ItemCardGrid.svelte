<script lang="ts">
	import { ITEM_PER_PAGE } from '$lib/constants';
	import ItemCard from './ItemCard.svelte';
	import PlaceholderCard from './PlaceholderCard.svelte';

	import { bindKey, unbindKey } from '@rwh/keystrokes';
	import { onDestroy, onMount } from 'svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import toPX from 'to-px';

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

	const prefersReducedMotion = new MediaQuery('prefers-reduced-motion');
	onMount(() => {
		if (prefersReducedMotion.current) {
			bindKey(['ArrowUp', 'PageUp'], (e) => {
				e.preventDefault();
				window.scrollBy(0, -1 * (toPX('10rem') ?? 50));
			});
			bindKey(['ArrowDown', 'PageDown'], (e) => {
				e.preventDefault();
				window.scrollBy(0, toPX('10rem') ?? 50);
			});
		}
	});

	onDestroy(() => {
		unbindKey(['ArrowUp', 'PageUp']);
		unbindKey(['ArrowDown', 'PageDown']);
	});
</script>

<div class="m-2 grid grid-cols-1 gap-8 overflow-visible sm:grid-cols-2 md:grid-cols-3">
	{#if !updated}
		{#each { length: ITEM_PER_PAGE } as _ (_)}
			<PlaceholderCard />
		{/each}
	{:else}
		{#each items as item (item.id)}
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
