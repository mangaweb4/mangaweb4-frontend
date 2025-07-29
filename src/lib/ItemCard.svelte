<script lang="ts">
	import { Card, CardBody, CardFooter } from '@sveltestrap/sveltestrap';

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

<Card class="{borderCls} h-100" id={id.toString()}>
	{#if placeholder}
		<div aria-label={name} style="display:block; aspect-ratio: 1/1.414">
			<Icon class="card-img-top h-100" data={photo} color="gray" width="210" height="210" />
		</div>
	{:else}
		<a href={linkUrl?.toString()} aria-label={name} style="display:block; aspect-ratio: 1/1.414">
			{#if imageLoadErr}
				<Icon class="card-img-top h-100" data={warning} color="yellow" width="210" height="210" />		
			{:else}
				<img
					bind:this={img}
					class="card-img-top h-100"
					alt={name}
					loading="lazy"
					src={imageUrl.toString()}
					style="object-fit: cover; object-position: 25% top"
					onerror={() => onImageError()}
				/>
			{/if}
		</a>
	{/if}
	<CardBody style="height: 8em; overflow:hidden;">
		<a href={placeholder == true ? '' : linkUrl?.toString()}>{name}</a>
	</CardBody>
	{#if accessTime != ''}
		<CardFooter style="height: 4em; overflow:hidden;">
			{Intl.DateTimeFormat('en', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				hour: 'numeric',
				minute: 'numeric',
				second: 'numeric',
				timeZoneName: 'short'
			}).format(new Date(accessTime))}
		</CardFooter>
	{/if}
	<CardFooter style="height: 3em; overflow:hidden;">
		{#if !placeholder}
			{#if favorite}
				<span class="badge bg-pink">
					<span><Icon data={star} /> Favorite </span>
				</span>
			{/if}

			{#if favoriteTag}
				<span class="badge bg-purple">
					<span><Icon data={tag} /> Favorite Tag</span>
				</span>
			{/if}

			{#if !isRead}
				<span class="badge bg-yellow">
					<span><Icon data={new_releases} /> New </span>
				</span>
			{:else}
				<span class="badge">
					{#if progressPercent < READ_THRESHOLD}
						<span><Icon data={menu_book} /> {Math.round(progressPercent)}% </span>
					{:else}
						<span><Icon data={check} /> Read </span>
					{/if}
				</span>
			{/if}
			{#if pageCount}
				<span class="badge bg-blue">
					<span><Icon data={insert_drive_file} /> {pageCount}p </span>
				</span>
			{/if}
			{#if itemCount}
				<span class="badge bg-blue">
					<span><Icon data={library_books} /> {itemCount}</span>
				</span>
			{/if}
		{/if}
	</CardFooter>
</Card>
