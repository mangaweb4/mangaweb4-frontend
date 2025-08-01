<script lang="ts">
	import favoriteIcon from '@mdi/svg/svg/star.svg?raw';
	import favoriteTagIcon from '@mdi/svg/svg/tag.svg?raw';
	import newIcon from '@mdi/svg/svg/alert-decagram.svg?raw';
	import readingIcon from '@mdi/svg/svg/book-open-variant.svg?raw';
	import readIcon from '@mdi/svg/svg/check.svg?raw';
	import pageCountIcon from '@mdi/svg/svg/file.svg?raw';
	import itemCountIcon from '@mdi/svg/svg/bookshelf.svg?raw';
	import errorThumbnail from '@mdi/svg/svg/alert-box.svg?raw';
	import placeholderThumbnail from '@mdi/svg/svg/minus-box.svg?raw';

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
	} else if (!isRead) {
		borderCls = 'border border-2 border-yellow-500';
	} else if (favorite) {
		borderCls = 'border border-2 border-pink-500';
	} else if (favoriteTag) {
		borderCls = 'border border-2 border-purple-500';
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

<div class="{borderCls} card bg-base-100 h-full shadow-xl" id={id.toString()}>
	<div class="mt-0 mb-0">
		{#if placeholder}
			<div aria-label={name} style="display:block; aspect-ratio: 1/1.414">
				<Icon
					class="card-img-top h-full"
					data={placeholderThumbnail}
					color="gray"
					width="359"
					height="510"
					viewBox="0 -8 24 48"
				/>
			</div>
		{:else}
			<a href={linkUrl?.toString()} aria-label={name} style="display:block; aspect-ratio: 1/1.414">
				{#if imageLoadErr}
					<Icon
						class="card-img-top h-full"
						data={errorThumbnail}
						color="yellow"
						width="359"
						height="510"
						viewBox="0 -8 24 48"
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
	</div>
	<div class="card-body">
		<div class="h-[4em] overflow-hidden">
			<a href={placeholder == true ? '' : linkUrl?.toString()}>{name}</a>
		</div>
		{#if accessTime != ''}
			<div class="h-[2em] overflow-hidden">
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

		{#if !placeholder}
			<div class="h-[2em] overflow-hidden">
				{#if favorite}
					<div class="badge p-2 bg-pink-200 text-pink-800">
						<Icon data={favoriteIcon} /> Favorite
					</div>
				{/if}

				{#if favoriteTag}
					<div class="badge p-2 bg-purple-200 text-purple-800">
						<Icon data={favoriteTagIcon} /> Favorite Tag
					</div>
				{/if}

				{#if !isRead}
					<div class="badge p-2 bg-yellow-200 text-yellow-800">
						<Icon data={newIcon} /> New
					</div>
				{:else}
					<div class="badge p-2 bg-emerald-200 text-emerald-800">
						{#if progressPercent < READ_THRESHOLD}
							<Icon data={readingIcon} /> {Math.round(progressPercent)}%
						{:else}
							<Icon data={readIcon} /> Read
						{/if}
					</div>
				{/if}
				{#if pageCount}
					<div class="badge p-2 bg-blue-200 text-blue-800">
						<Icon data={pageCountIcon} />
						{pageCount}p
					</div>
				{/if}
				{#if itemCount}
					<div class="badge p-2 bg-blue-200 text-blue-800">
						<Icon data={itemCountIcon} />
						{itemCount}
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
