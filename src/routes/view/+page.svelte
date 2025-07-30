<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import FavoriteButton from '$lib/FavoriteButton.svelte';
	import Toast from '$lib/Toast.svelte';
	import Container from '$lib/components/Container.svelte';
	import Content from '$lib/components/Content.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import SideBar from '$lib/components/SideBar.svelte';

	import type { PageData } from './$types';
	import ImageViewer from './Viewer.svelte';

	import { Icon } from 'svelte-icon';
	import informationOutline from '@mdi/svg/svg/information-outline.svg?raw';
	import downloadBox from '@mdi/svg/svg/download-box.svg?raw';
	import downloadBoxOutline from '@mdi/svg/svg/download-box-outline.svg?raw';
	import cropPortrait from '@mdi/svg/svg/crop-portrait.svg?raw';
	import tools from '@mdi/svg/svg/tools.svg?raw';

	let current = $state(0);
	let viewer: ImageViewer;
	let toast: Toast;

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let name = $derived(data.request.name);
	let pageCount = $derived(data.response.pageCount);
	let tags = $derived(data.response.tags);
	let favorite = $state(data.response.favorite);

	function createImageUrls(name: string, pageCount: number): string[] {
		const url = new URL('/api/manga/page_image', page.url.origin);
		const output = [];
		const user = data.request.user;
		url.searchParams.append('name', name);
		url.searchParams.append('user', user);
		for (let i = 0; i < pageCount; i++) {
			url.searchParams.set('i', i.toString());
			output.push(url.toString());
		}

		return output;
	}

	function downloadManga() {
		const url = new URL('/api/manga/download', page.url.origin);
		url.searchParams.set('name', name);

		download(url.toString());
	}

	function downloadPage() {
		const url = new URL('/api/manga/page_image', page.url.origin);
		url.searchParams.set('name', name);
		url.searchParams.set('i', current.toString());

		download(url.toString());
	}

	async function toggleFavorite() {
		const url = new URL('/api/manga/set_favorite', page.url.origin);
		url.searchParams.set('name', name);
		url.searchParams.set('favorite', !favorite ? 'true' : 'false');

		const resp = await fetch(url, { method: 'GET' });
		const json = await resp.json();

		/*
		if (json.favorite) {
			toast.show('Favorite', 'The current manga is now your favorite.');
		} else {
			toast.show('Favorite', 'The current manga is no longer your favorite.');
		}
*/
		favorite = json.favorite;
	}

	async function fixMetaData() {
		const url = new URL('/api/manga/repair', page.url.origin);
		url.searchParams.set('name', name);

		const resp = await fetch(url);
		const json = await resp.json();

		/*
		if (json.isSuccess) {
			toast.show('Fix metadata', 'The metadata has been updated.');
			invalidateAll();
		} else {
			toast.show('Fix metadata', 'The metadata updates fails.');
		}
			*/
	}

	async function updateCover() {
		const url = new URL('/view/thumb_edit', page.url.origin);
		url.searchParams.set('index', `${current}`);
		url.searchParams.set('name', name);

		goto(url);
	}

	function download(url: string) {
		let link = document.createElement('a');
		link.setAttribute('download', '');
		link.href = url;
		document.body.appendChild(link);

		link.click();
		link.remove();
	}

	function onIndexChange(i: number) {
		current = i;
	}

	function onValueChange(n: number) {
		//viewer.advance(n);
	}

	let navbarToggleOpen = $state(false);
	function handleUpdate(event: CustomEvent<boolean>) {
		navbarToggleOpen = event.detail;
	}

	let aboutOpen = $state(false);
	const aboutToggle = () => {
		aboutOpen = !aboutOpen;
	};

	let showMenu = $state(false);
	let aboutDialog: HTMLDialogElement;
</script>

<svelte:head>
	<title>View: {name}</title>
</svelte:head>

<Container bind:showMenu>
	<Content>
		<NavBar bind:showMenu title="View"></NavBar>
		<div class="fixed top-18 bottom-0 start-0 end-0">
			<ImageViewer
				imageURLs={createImageUrls(name, pageCount)}
				{onIndexChange}
				bind:this={viewer}
				startIndex={data.response.currentPage}
			/>
		</div>
	</Content>
	<SideBar bind:showMenu>
		<ul class="menu">
			<li class="text">
				<div class="tooltip tooltip-left" data-tip={name}>
					<div class="h-20 overflow-hidden">
						{name.length > 60 ? `${name.substring(0, 55)}...` : name}
					</div>
				</div>
			</li>
			<li>
				<button
					onclick={() => {
						showMenu = false;
						aboutDialog.showModal();
					}}
				>
					<Icon data={informationOutline} /> Information
				</button>
			</li>
			<li>
				<FavoriteButton onclick={() => toggleFavorite()} isFavorite={favorite}>
					Favorite
				</FavoriteButton>
			</li>

			<li class="menu-title">Tools</li>
			<li>
				<button onclick={() => downloadPage()}>
					<Icon data={downloadBoxOutline} /> Download current page
				</button>
			</li>

			<li>
				<button onclick={() => downloadManga()}>
					<Icon data={downloadBox} /> Download
				</button>
			</li>

			<li>
				<button onclick={() => updateCover()}>
					<Icon data={cropPortrait} /> Replace Cover
				</button>
			</li>

			<li>
				<button onclick={() => fixMetaData()}>
					<Icon data={tools} />
					Fix the manga
				</button>
			</li>
		</ul>
	</SideBar>
</Container>

<dialog class="modal" bind:this={aboutDialog}>
	<div class="modal-box w-full max-w-[1024px] mx-auto">
		<h3 class="text-lg font-bold">Information</h3>
		<table class="table">
			<tbody>
				<tr>
					<th>Title</th>
					<td>{name}</td>
				</tr>
				<tr>
					<th>Tags</th>
					<td>{tags.map((t) => t.name).join(', ')}</td>
				</tr>
				<tr>
					<th>Page Count</th>
					<td>{pageCount}</td>
				</tr>
				<tr>
					<th>Favorite ?</th>
					<td>{favorite ? 'Yes' : 'No'}</td>
				</tr>
			</tbody>
		</table>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

<!--
<Toast bind:this={toast} />
-->
