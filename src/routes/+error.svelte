<script lang="ts">
	import { page } from '$app/state';

	import SideBar from '$lib/components/SideBar.svelte';
	import Container from '$lib/components/Container.svelte';
	import Content from '$lib/components/Content.svelte';
	import NavBar from '$lib/components/NavBar.svelte';

	import { Icon } from 'svelte-icon';
	import icon from '@mdi/svg/svg/alert-circle.svg?raw';

	let showMenu = $state(false);
</script>

<Container bind:showMenu>
	<Content>
		<NavBar bind:showMenu><div class="text-xl">Error</div></NavBar>
		<div class="container mx-auto prose max-w-5xl mt-4">
			<div role="alert" class="alert alert-error">
				<Icon data={icon} />&nbsp;An error has occured.
			</div>

			<h2>Status {page.status}</h2>
			<p>
				{page.error?.message ?? ''}
			</p>

			<p>
				Please use the sidebar menu on the right to navigate, or using <strong>back button</strong> on
				the browse to go back.
			</p>
		</div>
	</Content>
	<SideBar bind:showMenu></SideBar>
</Container>
