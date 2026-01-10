<script lang="ts">
	import { Icon } from 'svelte-icon';
	import errorIcon from '@mdi/svg/svg/alert-circle.svg?raw';
	import logger from '$lib/logger';

	let { alt, src, grayscale = true, onLoaded = () => {} } = $props();

	let img: HTMLImageElement;
	let loading: 'lazy' | 'eager' = $state('lazy');
	let loaded = $state(false);
	let error = $state(false);
	let retry = 0;

	const MAX_RETRY = 10;

	export function forceLoad() {
		loading = 'eager';
	}

	function onImageError() {
		if (retry <= MAX_RETRY) {
			setTimeout(() => {
				let url = new URL(src);
				url.searchParams.append('retry', retry.toString());

				img.src = url.toString();
				retry++;
			}, 500);
		} else {
			error = true;
		}
	}

	function onImageLoad() {
		logger.debug(`img: ${alt} is loaded.`);

		if (!loaded) onLoaded();
		loaded = true;
	}
</script>

<div class="relative w-full h-full">
	<img
		class="absolute w-full h-full object-contain max-w-full max-h-full"
		class:grayscale
		{loading}
		{alt}
		src={src.toString()}
		onerror={() => onImageError()}
		onload={() => onImageLoad()}
		bind:this={img}
	/>
	{#if !loaded}
		<div class="absolute place-self-center inset-1/2">
			<span class="loading loading-bars loading-xl mx-auto my-auto"></span>
		</div>
	{:else if error}
		<div class="absolute place-self-center inset-1/2">
			<Icon data={errorIcon} width="64" height="64" class="fill-error stroke-error" />
		</div>
	{/if}
</div>
