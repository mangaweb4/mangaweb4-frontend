<script lang="ts">
	import { Icon } from 'svelte-icon';
	import ascendingIcon from '@mdi/svg/svg/sort-ascending.svg?raw';
	import creationTimeIcon from '@mdi/svg/svg/calendar-clock.svg?raw';
	import descendingIcon from '@mdi/svg/svg/sort-descending.svg?raw';
	import favoriteIcon from '@mdi/svg/svg/heart.svg?raw';
	import favoriteTagsIcon from '@mdi/svg/svg/tag-heart.svg?raw';
	import nameIcon from '@mdi/svg/svg/format-title.svg?raw';
	import noneIcon from '@mdi/svg/svg/cancel.svg?raw';
	import pageCountIcon from '@mdi/svg/svg/file-multiple.svg?raw';
	import searchIcon from '@mdi/svg/svg/magnify.svg?raw';
	import clearIcon from '@mdi/svg/svg/close-circle.svg?raw';
	import { Filter, SortField, SortOrder } from '$lib/grpc/types';
	import { browseTagURL } from '$lib/routes';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	let {
		data,
		search = $bindable(''),
		sort = $bindable(SortField.NAME),
		order = $bindable(SortOrder.ASCENDING),
		filter = $bindable(Filter.UNKNOWN)
	} = $props();

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
			sort: data.request.sort
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
		}

		return browseTagURL(page.url.origin, data.request.id, callOptions);
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
</script>

<fieldset class="fieldset w-full">
	<legend class="fieldset-legend">Search</legend>
	<div class="join gap-0 flex">
		<input class="input join-item flex-1" placeholder="title, author" bind:value={search} />
		<button
			class="btn join-item flex-none"
			onclick={() => {
				search = '';
				goto(browseTagURL(page.url.origin, data.request.id));
			}}
		>
			<Icon data={clearIcon} class="fill-slate-400 stroke-slate-800" />
		</button>
		<button
			class="btn join-item flex-none"
			onclick={() => goto(browseTagURL(page.url.origin, data.request.id, { search: search }))}
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
			{#each [SortField.NAME, SortField.CREATION_TIME, SortField.PAGECOUNT] as option}
				<li>
					<button
						class:menu-active={sort == option}
						onclick={() => goto(createSortBrowseURL({ sort: option }))}
					>
						{@render sortFieldTitle(option)}
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
						onclick={() => goto(createSortBrowseURL({ order: option }))}
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
			{#each [Filter.UNKNOWN, Filter.FAVORITE_ITEMS, Filter.FAVORITE_TAGS] as option}
				<li>
					<button
						class:menu-active={filter == option}
						onclick={() => goto(createBrowseURL({ filter: option }))}
					>
						{@render filterTitle(option)}
					</button>
				</li>
			{/each}
		</ul>
	</details>
</fieldset>

{#snippet sortFieldTitle(field: SortField)}
	{#if field == SortField.NAME}
		<Icon data={nameIcon} class="fill-slate-400 stroke-slate-800" /> Title
	{:else if field == SortField.CREATION_TIME}
		<Icon data={creationTimeIcon} class="fill-slate-400 stroke-slate-800" /> Creation time
	{:else if field == SortField.PAGECOUNT}
		<Icon data={pageCountIcon} class="fill-slate-400 stroke-slate-800" /> Page Count
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
	{:else if filter == Filter.FAVORITE_ITEMS}
		<Icon data={favoriteIcon} class="fill-slate-400 stroke-slate-800" /> Favorite items
	{:else if filter == Filter.FAVORITE_TAGS}
		<Icon data={favoriteTagsIcon} class="fill-slate-400 stroke-slate-800" /> Items with favorite tags
	{/if}
{/snippet}
