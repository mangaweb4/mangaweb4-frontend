<script lang="ts">
	import { page } from '$app/state';
	import Container from '$lib/components/Container.svelte';
	import Content from '$lib/components/Content.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import { browseURL, loginUrl } from '$lib/routes';
</script>

<svelte:head>
	<title>MangaWeb 4 Login</title>
</svelte:head>

<Container>
	<Content>
		<NavBar> <div class="text-xl">Login</div></NavBar>
		<div class="container mx-auto prose max-w-[1024px] mt-4">
			<h2>Login using OpenID Connect.</h2>

			<div>
				<a
					class="btn btn-primary btn-wide"
					href={loginUrl(page.url.origin, browseURL(page.url.origin)).toString()}
				>
					Login
				</a>
			</div>
		</div>
	</Content>
</Container>
