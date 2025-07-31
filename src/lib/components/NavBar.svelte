<script lang="ts">
	import { Icon } from 'svelte-icon';
	import menu from '@mdi/svg/svg/menu.svg?raw';
	import logo from '$lib/logo.svg?raw';
	import { browseURL } from '$lib/routes';
	import { page } from '$app/state';
	let { title, showMenu = $bindable(), hasmenu=true } = $props();
</script>

<div class="navbar bg-base-100 shadow-sm sticky top-0 z-1">
	<div class="w-full max-w-[1024px] mx-auto flex">
		<div class="flex-none">
			<a href={browseURL(page.url).toString()}><Icon data={logo} width="128px" height="48px" /></a>
		</div>
		<div class="flex-1 m-2">
			<div class="text-xl">{title}</div>
		</div>
		<div class="flex-none">
			{#if hasmenu}
			<button class="btn btn-square btn-ghost" onclick={() => (showMenu = true)}>
				<Icon data={menu} />
			</button>
			{/if}
		</div>
	</div>
</div>
