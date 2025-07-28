<script lang="ts">
	import { Icon } from '@sveltestrap/sveltestrap';
	import './custom.scss';

	let { isFavorite = false, children = null, onclick } = $props();
</script>

<button class="btn" class:btn-pink={isFavorite} class:btn-outline-pink={!isFavorite} {onclick}>
	{#if isFavorite}
		<span><Icon name="star-fill"/> {@render children?.()}</span>
	{:else}
		<span><Icon name="star"/> {@render children?.()}</span>
	{/if}
</button>
