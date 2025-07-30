<script lang="ts">
	import star from '@material-design-icons/svg/round/star.svg?raw';
	import tag from '@material-design-icons/svg/round/tag.svg?raw';
	import new_releases from '@material-design-icons/svg/round/new_releases.svg?raw';
	import menu_book from '@material-design-icons/svg/round/menu_book.svg?raw';
	import check from '@material-design-icons/svg/round/check.svg?raw';
	import insert_drive_file from '@material-design-icons/svg/round/insert_drive_file.svg?raw';
	import library_books from '@material-design-icons/svg/round/library_books.svg?raw';
	import warning from '@material-design-icons/svg/round/warning.svg?raw';
	import photo from '@material-design-icons/svg/round/photo.svg?raw';

	import { Icon } from 'svelte-icon';

	interface Props {
		favorite?: boolean;
		isRead?: boolean;
		favoriteTag?: boolean;
		id?: string | number;
		name?: string;
		pageCount?: number;
		itemCount?: number;
		linkUrl?: string | URL;
		imageUrl?: string | URL;
		accessTime?: number | string | Date;
		placeholder?: boolean;
		currentPage?: number;
	}

	let {
		favorite = false,
		isRead = false,
		favoriteTag = false,
		id = '',
		name = '',
		pageCount,
		itemCount,
		linkUrl,
		imageUrl = '',
		accessTime = '',
		placeholder,
		currentPage
	}: Props = $props();

	let borderCls = $state('');

	if (placeholder) {
		borderCls = '';
	} else if (favorite) {
		borderCls = 'border border-2 border-pink';
	} else if (!isRead) {
		borderCls = 'border border-2 border-yellow';
	} else if (favoriteTag) {
		borderCls = 'border border-2 border-purple';
	} else {
		borderCls = '';
	}

	let img: HTMLImageElement | undefined = $state();
	let imageLoadErr = $state(false);
	function onImageError() {
		imageLoadErr = true;
	}

	let progressPercent = $derived(((currentPage ?? 0) / (pageCount ?? 1)) * 100);
	const READ_THRESHOLD = 95; // 5%
</script>

<div class="{borderCls} card bg-base-100 h-full shadow-sm" id={id.toString()}>
	<figure class="mt-0 mb-0">
		{#if placeholder}
			<div aria-label={name} style="display:block; aspect-ratio: 1/1.414">
				<Icon class="card-img-top h-full" data={photo} color="gray" width="210" height="210" />
			</div>
		{:else}
			<a href={linkUrl?.toString()} aria-label={name} style="display:block; aspect-ratio: 1/1.414">
				{#if imageLoadErr}
					<Icon
						class="card-img-top h-full"
						data={warning}
						color="yellow"
						width="210"
						height="210"
					/>
				{:else}
					<img
						bind:this={img}
						class="card-img-top h-full mt-0 mb-0"
						alt={name}
						loading="lazy"
						src={imageUrl.toString()}
						style="object-fit: cover; object-position: 25% top"
						onerror={() => onImageError()}
					/>
				{/if}
			</a>
		{/if}
	</figure>
	<div class="card-body">
		<div style="height: 4em; overflow:hidden;">
			<a href={placeholder == true ? '' : linkUrl?.toString()}>{name}</a>
		</div>
		{#if accessTime != ''}
			<div style="height: 2em; overflow:hidden;">
				{Intl.DateTimeFormat('en', {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
					hour: 'numeric',
					minute: 'numeric',
					second: 'numeric',
					timeZoneName: 'short'
				}).format(new Date(accessTime))}
			</div>
		{/if}
		<div style="height: 2em; overflow:hidden;"></div>
		{#if !placeholder}
			{#if favorite}
				<span class="badge bg-pink badge-xs">
					<Icon data={star} /> Favorite
				</span>
			{/if}

			{#if favoriteTag}
				<span class="badge bg-purple badge-xs">
					<Icon data={tag} /> Favorite Tag
				</span>
			{/if}

			{#if !isRead}
				<span class="badge bg-yellow badge-xs">
					<Icon data={new_releases} /> New
				</span>
			{:else}
				<span class="badge badge-xs">
					{#if progressPercent < READ_THRESHOLD}
						<Icon data={menu_book} /> {Math.round(progressPercent)}%
					{:else}
						<Icon data={check} /> Read
					{/if}
				</span>
			{/if}
			{#if pageCount}
				<span class="badge bg-blue badge-xs">
					<Icon data={insert_drive_file} />
					{pageCount}p
				</span>
			{/if}
			{#if itemCount}
				<span class="badge bg-blue badge-xs">
					<Icon data={library_books} />
					{itemCount}
				</span>
			{/if}
		{/if}
	</div>
</div>
