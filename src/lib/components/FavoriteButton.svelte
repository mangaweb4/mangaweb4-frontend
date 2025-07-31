<script lang="ts">
	import { Icon } from 'svelte-icon';
	import star from '@mdi/svg/svg/star.svg?raw';
	import star_outline from '@mdi/svg/svg/star-outline.svg?raw';

	let { isFavorite = false, children, onclick } = $props();
</script>

<button class="btn text-pink-800" class:bg-pink-200={isFavorite} class:border-pink-500={!isFavorite} {onclick}>
	{#if isFavorite}
		<Icon data={star} /> {@render children?.()}
	{:else}
		<Icon data={star_outline} /> {@render children?.()}
	{/if}
</button>
