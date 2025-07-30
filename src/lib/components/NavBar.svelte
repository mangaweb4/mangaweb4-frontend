<script lang="ts">
	import { Icon } from 'svelte-icon';
	import menu from '@mdi/svg/svg/menu.svg?raw';

	let { title, showMenu = $bindable() } = $props();
</script>

<div class="navbar bg-base-100 shadow-sm sticky top-0 z-1">
	<div class="w-full max-w-[1024px] mx-auto flex">
		<div class="flex-1">
			<p class="text-xl">{title}</p>
		</div>
		<div class="flex-none">
			<button class="btn btn-square btn-ghost" onclick={() => (showMenu = true)}>
				<Icon data={menu} />
			</button>
		</div>
	</div>
</div>
