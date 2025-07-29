<script lang="ts">
	import { Button } from '@sveltestrap/sveltestrap';
	import { Icon } from 'svelte-icon';
	import arrow_upward from '@material-design-icons/svg/round/arrow_upward.svg?raw';

	function moveToTop() {
		location.hash = '#top';
		location.hash = '';
	}
</script>

<nav aria-label="Move to top navigation" class="position-fixed bottom-0 end-0 p-3">
	<Button color="secondary" onclick={moveToTop}>
		<Icon data={arrow_upward} />
		<span class="d-none d-sm-block">Top</span>
	</Button>
</nav>
