<script lang="ts">
	import { Icon } from 'svelte-icon';
	import isFavoriteIcon from '@mdi/svg/svg/heart.svg?raw';
	import isNotFavoriteIcon from '@mdi/svg/svg/heart-outline.svg?raw';

	let { isFavorite = false, children, onclick } = $props();
</script>

<button class="btn text-pink-800" class:bg-pink-200={isFavorite} class:border-pink-500={!isFavorite} {onclick}>
	{#if isFavorite}
		<Icon data={isFavoriteIcon} /> {@render children?.()}
	{:else}
		<Icon data={isNotFavoriteIcon} /> {@render children?.()}
	{/if}
</button>
