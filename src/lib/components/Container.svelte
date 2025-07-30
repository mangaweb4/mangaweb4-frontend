<script lang="ts">
	let { showMenu = $bindable(), children } = $props();
</script>

<div class="drawer drawer-end">
	<input type="checkbox" class="drawer-toggle" bind:checked={showMenu} />
	{@render children?.()}
</div>
