<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import Content from '$lib/components/Content.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
</script>

<svelte:head>
	<title>MangaWeb 4 Logout</title>
</svelte:head>

<Container>
	<Content>
		<NavBar title="Login"></NavBar>
		<div class="container mx-auto prose max-w-[1024px] mt-4">
			<h2>Logout from MangaWeb 4.</h2>
		</div>
	</Content>
</Container>
