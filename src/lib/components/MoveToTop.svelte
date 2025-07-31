<script lang="ts">
	import { Icon } from 'svelte-icon';
	import arrow_upward from '@mdi/svg/svg/arrow-up-box.svg?raw';

	function moveToTop() {
		location.hash = '#top';
		location.hash = '';
	}
</script>

<nav aria-label="Move to top navigation" class="fixed bottom-0 end-0 p-3">
	<button class="btn" onclick={moveToTop}>
		<Icon data={arrow_upward} />
		<span class="d-none d-sm-block">Top</span>
	</button>
</nav>
