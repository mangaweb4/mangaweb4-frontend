<script lang="ts">
	import { page } from '$app/state';
	import { Container, Button } from '@sveltestrap/sveltestrap';
	import { browseURL, loginUrl } from '$lib/routes';
</script>

<svelte:head>
	<title>MangaWeb 4 Login</title>
</svelte:head>

<Container>
	<h1 class="text-center mt-5">MangaWeb 4</h1>
	<p class="fluid text-center mt-5">Login using OpenID Connect.</p>

	<div class="fluid text-center">
		<Button color="primary" size="lg" href={loginUrl(page.url.origin, browseURL(page.url.origin)).toString()}>Login</Button>
	</div>
</Container>
