<script lang="ts">
	import { Icon } from 'svelte-icon';
	import icon from '@mdi/svg/svg/arrow-up-box.svg?raw';

	function moveToTop() {
		location.hash = '#top';
		location.hash = '';
	}
</script>

<nav aria-label="Move to top navigation" class="fixed bottom-10 end-5 hidden md:flex xl:end-30">
	<button class="btn" onclick={moveToTop}>
		<Icon data={icon} class="fill-slate-400 stroke-slate-800"/>
		<span class="d-none d-sm-block">Top</span>
	</button>
</nav>
