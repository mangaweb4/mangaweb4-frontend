<script lang="ts">
	let { children } = $props();
</script>

<div class="drawer-content">
	{@render children?.()}
</div>
