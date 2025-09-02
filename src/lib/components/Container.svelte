<script lang="ts">
	let { showMenu = $bindable(false), children } = $props();
</script>

<div class="drawer-end bg-base-300">
	<input type="checkbox" class="drawer-toggle" bind:checked={showMenu} />
	{@render children?.()}
</div>
