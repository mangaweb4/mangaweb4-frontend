<script lang="ts">
	import favoriteIcon from '@mdi/svg/svg/star.svg?raw';
	import favoriteTagIcon from '@mdi/svg/svg/tag.svg?raw';
	import newIcon from '@mdi/svg/svg/alert-decagram.svg?raw';
	import readingIcon from '@mdi/svg/svg/book-open-variant.svg?raw';
	import readIcon from '@mdi/svg/svg/check.svg?raw';
	import pageCountIcon from '@mdi/svg/svg/file.svg?raw';
	import itemCountIcon from '@mdi/svg/svg/bookshelf.svg?raw';
	import errorThumbnail from '@mdi/svg/svg/alert-box.svg?raw';
	import dummyThumbnail from '@mdi/svg/svg/minus-box.svg?raw';

	import { Icon } from 'svelte-icon';
	import { goto } from '$app/navigation';

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
		accessTime?: number | boolean | string | Date;
		dummy?: boolean;
		currentPage?: number;
	}

	let {
		favorite = false,
		isRead = true,
		favoriteTag = false,
		id = '',
		name = '',
		pageCount = 0,
		itemCount = 0,
		linkUrl = '',
		imageUrl = '',
		accessTime = false,
		dummy = false,
		currentPage = 0
	}: Props = $props();

	let borderCls = $derived.by(() => {
		if (!isRead) {
			return 'border border-2 border-yellow-500';
		} else if (favorite) {
			return 'border border-2 border-pink-500';
		} else if (favoriteTag) {
			return 'border border-2 border-purple-500';
		} else {
			return '';
		}
	});

	let img: HTMLImageElement | undefined = $state();
	let imageLoadErr = $state(false);
	let imageLoad = $state(false);
	
	function onImageError() {
		imageLoadErr = true;
	}

	function onImageLoad() {
		imageLoad = true;
	}

	let progressPercent = $derived(((currentPage ?? 0) / (pageCount ?? 1)) * 100);
	const READ_THRESHOLD = 95; // 5%
</script>

<div class="{borderCls} card card-border border-2 bg-base-100 h-full shadow-xl" id={id.toString()}>
	{#if dummy}
		<div class="mt-0 mb-0 h-full">
			<div aria-label={name} class="aspect-ratio-[1/1.414]">
				<Icon class="mx-auto mt-18" data={dummyThumbnail} color="gray" width="180" height="180" />
			</div>
		</div>
		<div class="card-body">
			<div class="h-32">
				<div>
					<button
						class="link link-hover"
						onclick={() => {
							if (!dummy && linkUrl) goto(linkUrl);
						}}
					>
						<div class="w-full h-full">
							{name}
						</div>
					</button>
				</div>
			</div>
			{#if accessTime == true}
				<div class="divider"></div>
				<div class="h-[2em] overflow-hidden"></div>
			{/if}
		</div>
	{:else}
		<div class="mt-0 mb-0">
			<a href={linkUrl?.toString()} aria-label={name}>
				<div class="aspect-[1/1.414] relative">
					{#if imageLoadErr}
						<Icon
							class="absolute place-self-center inset-1/2 fill-yellow-400 stroke-yellow-800"
							data={errorThumbnail}
							width="180"
							height="180"
						/>
					{:else if !imageLoad}
						<div class="absolute place-self-center inset-1/2">
							<span class="loading loading-bars loading-xl mx-auto my-auto"></span>
						</div>
					{/if}
					<img
						bind:this={img}
						class="h-full w-full rounded-t-[5px] object-cover object-[25%_top]"
						alt={name}
						loading="lazy"
						src={imageUrl.toString()}
						onerror={() => onImageError()}
						onload={() => onImageLoad()}
					/>
				</div>
			</a>

			<div class="absolute top-4 -right-2 grid grid-cols-1 gap-2 place-items-end">
				{#if favorite}
					<div class="badge p-2 bg-pink-200 text-pink-800 border-pink-800">
						<Icon data={favoriteIcon} class="fill-pink-400" /> Favorite
					</div>
				{/if}

				{#if favoriteTag}
					<div class="badge p-2 bg-purple-200 text-purple-800 border-purple-800">
						<Icon data={favoriteTagIcon} class="fill-purple-400" /> Favorite Tag
					</div>
				{/if}

				{#if !isRead}
					<div class="badge p-2 bg-yellow-200 text-yellow-800 border-yellow-800">
						<Icon data={newIcon} class="fill-yellow-400" /> New
					</div>
				{:else if pageCount != 0}
					<div class="badge p-2 bg-emerald-200 text-emerald-800 border-emerald-800">
						{#if progressPercent < READ_THRESHOLD}
							<Icon data={readingIcon} class="fill-emerald-400" /> {Math.round(progressPercent)}%
						{:else}
							<Icon data={readIcon} class="fill-emerald-400" /> Read
						{/if}
					</div>
				{/if}
				{#if pageCount}
					<div class="badge p-2 bg-blue-200 text-blue-800 border-blue-800">
						<Icon data={pageCountIcon} class="fill-blue-400" />
						{pageCount}p
					</div>
				{/if}
				{#if itemCount}
					<div class="badge p-2 bg-blue-200 text-blue-800 border-blue-800">
						<Icon data={itemCountIcon} class="fill-blue-400" />
						{itemCount}
					</div>
				{/if}
			</div>
		</div>
		<div class="card-body">
			<div class="tooltip">
				<div class="tooltip-content">
					{name}
				</div>
				<div class="h-32 overflow-hidden">
					<div>
						<button
							class="link link-hover"
							onclick={() => {
								if (!dummy && linkUrl) goto(linkUrl);
							}}
						>
							<div class="w-full h-full">
								{name}
							</div>
						</button>
					</div>
				</div>
			</div>
			{#if typeof accessTime != 'boolean'}
				<div class="divider">Access time</div>
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
		</div>
	{/if}
</div>
