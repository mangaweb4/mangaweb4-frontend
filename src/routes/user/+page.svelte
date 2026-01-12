<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Container from '$lib/components/Container.svelte';
	import Content from '$lib/components/Content.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import SideBar from '$lib/components/SideBar.svelte';
	import { logoutURL } from '$lib/routes';

	import md5 from 'md5';

	import { Icon } from 'svelte-icon';
	import logoutIcon from '@mdi/svg/svg/logout.svg?raw';

	let { email, name } = page.data;
	let showMenu = $state(false);
</script>

<svelte:head>
	<title>User: Mangaweb 4</title>
</svelte:head>

<Container bind:showMenu>
	<Content>
		<NavBar bind:showMenu><div class="text-xl">User</div></NavBar>
		<div class="prose container mx-auto mt-4 max-w-5xl">
			<div class="avatar">
				<div class="rounded-full">
					<img class="mt-0" alt="user avartar" src="https://www.gravatar.com/avatar/{md5(email)}" />
				</div>
			</div>

			<h2 class="mt-4">{name}</h2>
			<p><b>Email</b> {email}</p>

			<button
				class="btn btn-primary btn-wide mt-4"
				onclick={() => goto(logoutURL(page.url.origin))}
			>
				<Icon data={logoutIcon} />&nbsp;Logout
			</button>

			<div class="mt-4 mb-4">
				<h3>Information</h3>
				<table class="table">
					<thead>
						<tr>
							<th colspan="2"> User details </th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td class="align-middle"> User ID </td>
							<td>
								{page.data.userId}
							</td>
						</tr>
					</tbody>

					<thead>
						<tr>
							<th colspan="2"> Reading statistic </th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td class="align-middle"> # Read items </td>
							<td>
								{page.data.readItemCount} / {page.data.backend.itemCount}
							</td>
						</tr>
						<tr>
							<td class="align-middle"> # Favorite items </td>
							<td>
								{page.data.favoriteItemCount} / {page.data.backend.itemCount}
							</td>
						</tr>
						<tr>
							<td class="align-middle"> # Favorite tags </td>
							<td>
								{page.data.favoriteTagCount} / {page.data.backend.tagCount}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</Content>
	<SideBar bind:showMenu />
</Container>
