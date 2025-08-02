<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import Content from '$lib/components/Content.svelte';
	import FavoriteButton from '$lib/components/FavoriteButton.svelte';
	import ImageViewer from './Viewer.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import SideBar from '$lib/components/SideBar.svelte';
	import Toast from '$lib/components/Toast.svelte';

	import { browseURL } from '$lib/routes';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import type { PageData } from './$types';

	import { Icon } from 'svelte-icon';
	import downloadIcon from '@mdi/svg/svg/download.svg?raw';
	import downloadPageIcon from '@mdi/svg/svg/download-box.svg?raw';
	import fixIcon from '@mdi/svg/svg/tools.svg?raw';
	import infoIcon from '@mdi/svg/svg/information-outline.svg?raw';
	import tagIcon from '@mdi/svg/svg/tag.svg?raw';
	import thumbnailIcon from '@mdi/svg/svg/crop-portrait.svg?raw';

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

		if (json.favorite) {
			toast.add('The current item is now your favorite.', 'success');
		} else {
			toast.add('The current item is no longer your favorite.', 'success');
		}

		favorite = json.favorite;
	}

	async function fixMetaData() {
		const url = new URL('/api/manga/repair', page.url.origin);
		url.searchParams.set('name', name);

		const resp = await fetch(url);
		const json = await resp.json();

		if (json.isSuccess) {
			toast.add('The item metadata has been updated.', 'success');
			invalidateAll();
		} else {
			toast.add('The item metadata updates fails.', 'error');
		}
	}

	async function changeThumbnail() {
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
					<Icon data={infoIcon} /> Information
				</button>
			</li>
			<li>
				<FavoriteButton onclick={() => toggleFavorite()} isFavorite={favorite}>
					Favorite
				</FavoriteButton>
			</li>

			<li class="menu-title">Tags</li>
			{#each tags as t}
				<li>
					<button onclick={() => goto(browseURL(page.url, { tag: t.name }))}>
						<Icon data={tagIcon} />
						{t.name}
					</button>
				</li>
			{/each}

			<li class="menu-title">Tools</li>
			<li>
				<button onclick={() => downloadPage()}>
					<Icon data={downloadPageIcon} /> Download current page
				</button>
			</li>

			<li>
				<button onclick={() => downloadManga()}>
					<Icon data={downloadIcon} /> Download
				</button>
			</li>

			<li>
				<button onclick={() => changeThumbnail()}>
					<Icon data={thumbnailIcon} /> Change thumbnail
				</button>
			</li>

			<li>
				<button onclick={() => fixMetaData()}>
					<Icon data={fixIcon} /> Fix item metadata
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

<Toast bind:this={toast} />
