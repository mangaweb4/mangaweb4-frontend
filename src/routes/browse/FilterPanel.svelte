<script lang="ts">
	import { Filter, SortField, SortOrder } from '$lib/grpc/types';

	import { Icon } from 'svelte-icon';
	import searchIcon from '@mdi/svg/svg/magnify.svg?raw';
	import clearIcon from '@mdi/svg/svg/close-circle.svg?raw';
	import { browseURL } from '$lib/routes';
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
			const { filter, item_per_page, order, page, search, sort } = options;
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
</script>

<fieldset class="fieldset w-full">
	<legend class="fieldset-legend">Search</legend>
	<div class="join gap-0 flex">
		<input class="input join-item flex-1" placeholder="title, author" bind:value={search} />
		<button
			class="btn join-item flex-none"
			onclick={() => {
				search = '';
				goto(browseURL(page.url.origin));
			}}
		>
			<Icon data={clearIcon} class="fill-slate-400 stroke-slate-800" />
		</button>
		<button
			class="btn join-item flex-none"
			onclick={() => goto(browseURL(page.url.origin, { search: search }))}
		>
			<Icon data={searchIcon} class="fill-slate-400 stroke-slate-800" />
		</button>
	</div>
</fieldset>

<fieldset class="fieldset w-full">
	<legend class="fieldset-legend">Sort By</legend>
	<select
		class="select"
		onchange={(e: Event) => {
			const target = e.target as HTMLSelectElement;
			goto(
				createSortBrowseURL({
					sort: parseInt(target.value)
				})
			);
		}}
	>
		<option value={SortField.NAME} selected={sort == SortField.NAME}> Title </option>
		<option value={SortField.CREATION_TIME} selected={sort == SortField.CREATION_TIME}>
			Creation time
		</option>
		<option value={SortField.PAGECOUNT} selected={sort == SortField.PAGECOUNT}> Page Count </option>
	</select>
</fieldset>

<fieldset class="fieldset w-full">
	<legend class="fieldset-legend">Order</legend>
	<select
		class="select"
		onchange={(e: Event) => {
			const target = e.target as HTMLSelectElement;
			goto(
				createSortBrowseURL({
					order: parseInt(target.value)
				})
			);
		}}
	>
		<option value={SortOrder.ASCENDING} selected={order == SortOrder.ASCENDING}> Ascending </option>
		<option value={SortOrder.DESCENDING} selected={order == SortOrder.DESCENDING}>
			Descending
		</option>
	</select>
</fieldset>
<fieldset class="fieldset w-full">
	<legend class="fieldset-legend">Filter</legend>
	<select
		class="select"
		onchange={(e: Event) => {
			const target = e.target as HTMLSelectElement;
			goto(
				createBrowseURL({
					filter: parseInt(target.value)
				})
			);
		}}
	>
		<option value={Filter.UNKNOWN} selected={filter == Filter.UNKNOWN}> None </option>
		<option value={Filter.FAVORITE_ITEMS} selected={filter == Filter.FAVORITE_ITEMS}>
			Favorite items
		</option>
		<option value={Filter.FAVORITE_TAGS} selected={filter == Filter.FAVORITE_TAGS}>
			Items with favorite tags
		</option>
	</select>
</fieldset>
