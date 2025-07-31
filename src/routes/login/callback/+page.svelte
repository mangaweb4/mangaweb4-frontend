<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import Content from '$lib/components/Content.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
</script>

<svelte:head>
	<title>MangaWeb 4 Login</title>
</svelte:head>

<Container>
	<Content>
		<NavBar title="Login"></NavBar>
		<div class="container mx-auto prose max-w-[1024px] mt-4">
			<h2>Authorized</h2>
		</div>
	</Content>
</Container>
