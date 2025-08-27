<script lang="ts">
	import { Icon } from 'svelte-icon';
	import menu from '@mdi/svg/svg/menu.svg?raw';
	import logo from '$lib/assets/logo.svg?raw';
	import { browseURL } from '$lib/routes';
	import { page } from '$app/state';
	let { children = undefined, showMenu = $bindable(), hasmenu = true } = $props();
</script>

<div class="navbar bg-base-100 shadow-sm sticky top-0 z-1">
	<div class="flex w-full max-w-[1024px] mx-auto">
		<div class="flex-none place-self-center px-2">
			<a href={browseURL(page.url).toString()}><Icon data={logo} width="128px" height="48px" /></a>
		</div>
		<div class="flex-1 grow place-self-center overflow-hidden">
			{@render children?.()}
		</div>
		<div class="flex-none place-self-center px-2">
			{#if hasmenu}
				<button class="btn btn-square btn-ghost" onclick={() => (showMenu = true)}>
					<Icon data={menu} class="fill-slate-400 stroke-slate-800" />
				</button>
			{/if}
		</div>
	</div>
</div>
