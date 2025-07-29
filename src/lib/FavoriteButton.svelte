<script lang="ts">
	import star_border from '@material-design-icons/svg/round/star_border.svg?raw';
	import star from '@material-design-icons/svg/round/star.svg?raw';

	import { Icon } from 'svelte-icon';

	let { isFavorite = false, children, onclick } = $props();
</script>

<button class="btn" class:btn-pink={isFavorite} class:btn-outline-pink={!isFavorite} {onclick}>
	{#if isFavorite}
		<span><Icon data={star} /> {@render children?.()}</span>
	{:else}
		<span><Icon data={star_border} /> {@render children?.()}</span>
	{/if}
</button>
