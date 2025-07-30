<script lang="ts">
	import { Icon } from 'svelte-icon';
	import star from '@mdi/svg/svg/star.svg?raw';
	import star_outline from '@mdi/svg/svg/star-outline.svg?raw';

	let { isFavorite = false, children, onclick } = $props();
</script>

<button class="btn" class:btn-pink={isFavorite} class:btn-outline-pink={!isFavorite} {onclick}>
	{#if isFavorite}
		<Icon data={star} /> {@render children?.()}
	{:else}
		<Icon data={star_outline} /> {@render children?.()}
	{/if}
</button>
