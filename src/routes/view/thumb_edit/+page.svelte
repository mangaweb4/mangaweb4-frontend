<script lang="ts">
	import { page } from '$app/state';

	import Cropper, { type CropArea, type OnCropCompleteEvent } from 'svelte-easy-crop';
	import Container from '$lib/components/Container.svelte';
	import Content from '$lib/components/Content.svelte';
	import SideBar from '$lib/components/SideBar.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import Toast from '$lib/components/Toast.svelte';

	import { Icon } from 'svelte-icon';
	import viewIcon from '@mdi/svg/svg/book-open.svg?raw';
	import { goto } from '$app/navigation';
	import { viewURL } from '$lib/routes';

	function createImageUrl(name: string, page: number, base: string | URL): URL {
		const url = new URL('/api/manga/page_image', base);
		if (name != null) {
			url.searchParams.append('name', name);
		}
		url.searchParams.set('i', page.toString());

		return url;
	}

	let { data } = $props();

	let name = $derived(data.request.name);
	let index = $state(0);
	const image = $derived(name != null ? createImageUrl(name, index, page.url).toString() : '');
	let pageCount = $derived(data.response.pageCount);

	let crop = $state({ x: 0, y: 0 });
	let zoom = $state(1);
	let aspect = $state(127 / 180);

	let cropDetails: CropArea;

	function onCropComplete(e: OnCropCompleteEvent) {
		cropDetails = e.pixels;
	}

	async function updateCover() {
		const url = new URL('/api/manga/update_cover', page.url.origin);

		url.searchParams.set('i', index.toString());
		url.searchParams.set('x', cropDetails.x.toString());
		url.searchParams.set('y', cropDetails.y.toString());
		url.searchParams.set('w', cropDetails.width.toString());
		url.searchParams.set('h', cropDetails.height.toString());
		url.searchParams.set('name', name ?? '');

		const resp = await fetch(url, { method: 'GET' });
		const json = await resp.json();

		if (json.success) {
			toast.add('The thumbnail is updated successfully.', 'success');
		} else {
			toast.add('The thumbnail is not updated.', 'error');
		}
	}

	let showMenu = $state(false);
	let toast: Toast;
</script>

<Container bind:showMenu>
	<Content>
		<NavBar bind:showMenu title="Edit thumbnail"></NavBar>
		<div class="container mx-auto prose max-w-[1024px] mt-4">
			<h2>{name}</h2>
			<div>
				<label class="input">
					<span class="label">Use thumbnail from page</span>
					<input
						class="input join-input"
						type="number"
						bind:value={index}
						min="0"
						max={pageCount}
					/>
				</label>
			</div>
			<div class="my-5" style="position: relative; width:100%; height:500px;">
				<Cropper {image} bind:crop bind:zoom {aspect} oncropcomplete={onCropComplete} />
			</div>

			<button class="btn btn-primary btn-wide" onclick={() => updateCover()}>Save</button>

			<h3>Instruction</h3>
			<ol>
				<li>Select the page that contains the desired thumbnail.</li>
				<li>Move the image inside the editor to highlight the desired area.</li>
				<li>Press <strong>Save</strong> button to commit.</li>
			</ol>
		</div>
	</Content>
	<SideBar bind:showMenu>
		<ul class="menu">
			<li>
				<button onclick={() => goto(viewURL(page.url, name))}>
					<Icon data={viewIcon} /> View current item.
				</button>
			</li>
		</ul>
	</SideBar>
</Container>

<Toast bind:this={toast} />
