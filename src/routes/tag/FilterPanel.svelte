<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { SortField, SortOrder, Filter } from '$lib/grpc/types';
	import { tagURL } from '$lib/routes';
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

	let {
		data,
		search = $bindable(''),
		sort = $bindable(SortField.NAME),
		order = $bindable(SortOrder.ASCENDING),
		filter = $bindable(Filter.UNKNOWN)
	} = $props();

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
</script>

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
