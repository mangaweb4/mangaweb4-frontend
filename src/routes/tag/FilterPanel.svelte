<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { SortField, SortOrder, Filter } from '$lib/grpc/types';
	import { tagURL } from '$lib/routes';
	import { Icon } from 'svelte-icon';

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
	<select
		class="select"
		onchange={(e: Event) => {
			const target = e.target as HTMLSelectElement;
			const sort = parseInt(target.value);
			const order = ((s: SortField) => {
				switch (s) {
					default:
						return undefined;

					case SortField.NAME:
						return SortOrder.ASCENDING;

					case SortField.ITEMCOUNT:
					case SortField.LAST_UPDATE:
						return SortOrder.DESCENDING;
				}
			})(sort);
			goto(createTagListUrl({ sort: sort, order: order }));
		}}
	>
		<option value={SortField.NAME} selected={sort == SortField.NAME}> Title </option>
		<option value={SortField.ITEMCOUNT} selected={sort == SortField.ITEMCOUNT}> Item Count </option>
		<option value={SortField.LAST_UPDATE} selected={sort == SortField.LAST_UPDATE}>
			Last Update
		</option>
	</select>
</fieldset>
<fieldset class="fieldset w-full">
	<legend class="fieldset-legend">Order</legend>

	<select
		class="select"
		onchange={(e: Event) => {
			const target = e.target as HTMLSelectElement;
			const order = parseInt(target.value);

			goto(createTagListUrl({ order: order }));
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
			const filter = parseInt(target.value);

			goto(tagURL(page.url, { filter: filter }));
		}}
	>
		<option value={Filter.UNKNOWN} selected={filter == Filter.UNKNOWN}> None </option>
		<option value={Filter.FAVORITE_TAGS} selected={filter == Filter.FAVORITE_TAGS}>
			Favorite Tags
		</option>
	</select>
</fieldset>
