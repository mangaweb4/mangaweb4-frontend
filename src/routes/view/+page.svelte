<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import FavoriteButton from '$lib/FavoriteButton.svelte';
	import Toast from '$lib/Toast.svelte';
	import { aboutURL, browseURL, historyURL, userURL } from '$lib/routes';

	import {
		Collapse,
		Dropdown,
		DropdownItem,
		DropdownMenu,
		DropdownToggle,
		Icon,
		Modal,
		Nav,
		NavItem,
		NavLink,
		Navbar,
		NavbarBrand,
		NavbarToggler,
		Table
	} from '@sveltestrap/sveltestrap';

	import type { PageData } from './$types';
	import ImageViewer from './ImageViewer.svelte';
	import PageScroll from './PageScroll.svelte';

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
			toast.show('Favorite', 'The current manga is now your favorite.');
		} else {
			toast.show('Favorite', 'The current manga is no longer your favorite.');
		}

		favorite = json.favorite;
	}
	
	async function fixMetaData() {
		const url = new URL('/api/manga/repair', page.url.origin);
		url.searchParams.set("name", name)

		const resp = await fetch(url);
		const json = await resp.json();

		if (json.isSuccess) {
			toast.show('Fix metadata', 'The metadata has been updated.');
			invalidateAll();
		} else {
			toast.show('Fix metadata', 'The metadata updates fails.');
		}
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
		viewer.advance(n);
	}

	let navbarToggleOpen = $state(false);
	function handleUpdate(event: CustomEvent<boolean>) {
		navbarToggleOpen = event.detail;
	}

	let aboutOpen = $state(false);
	const aboutToggle = () => {
		aboutOpen = !aboutOpen;
	};
</script>

<svelte:head>
	<title>View: {name}</title>
</svelte:head>

<PageScroll PageCount={pageCount} {onValueChange} Current={current} />

<div class="fullscreen" style="padding-top:80px;">
	<ImageViewer
		imageURLs={createImageUrls(name, pageCount)}
		{onIndexChange}
		bind:this={viewer}
		startIndex={data.response.currentPage}
	/>
</div>

<Navbar color="dark" dark expand="md" sticky={'top'}>
	<NavbarBrand href="/">View</NavbarBrand>
	<NavbarToggler onclick={() => (navbarToggleOpen = !navbarToggleOpen)} />
	<Collapse isOpen={navbarToggleOpen} navbar expand="md" on:update={handleUpdate}>
		<Nav navbar>
			<Dropdown nav inNavbar>
				<DropdownToggle nav caret>Browse</DropdownToggle>
				<DropdownMenu>
					<DropdownItem onclick={() => goto(browseURL(page.url.origin))}>
						<Icon name="list-ul" class="me-3" />
						All items
					</DropdownItem>
					<DropdownItem divider />
					<DropdownItem header>Tags</DropdownItem>
					{#each tags as tag}
						<DropdownItem onclick={() => goto(browseURL(page.url.origin, { tag: tag.name }))}>
							{#if tag.isFavorite}
								<Icon name="star-fill" class="me-3" />
							{:else}
								<Icon name="tag" class="me-3" />
							{/if}
							{tag.name}
						</DropdownItem>
					{/each}
				</DropdownMenu>
			</Dropdown>
			<Dropdown nav inNavbar>
				<DropdownToggle nav caret>Tools</DropdownToggle>
				<DropdownMenu>
					<DropdownItem header>Download</DropdownItem>
					<DropdownItem onclick={() => downloadPage()}>
						<Icon name="download" class="me-3" />
						Download Current Page
					</DropdownItem>
					<DropdownItem onclick={() => downloadManga()}>
						<Icon name="download" class="me-3" />
						Download Manga
					</DropdownItem>
					<DropdownItem divider />
					<DropdownItem header>Maintenance</DropdownItem>
					<DropdownItem onclick={() => updateCover()}>
						<Icon name="journal-arrow-up" class="me-3" />
						Replace Cover
					</DropdownItem>
					
					<DropdownItem onclick={() => fixMetaData()}>
						<Icon name="tools" class="me-3" />
						Fix the manga
					</DropdownItem>
					
				</DropdownMenu>
			</Dropdown>
			<NavItem>
				<NavLink onclick={() => goto(historyURL(page.url.origin))}>History</NavLink>
			</NavItem>
			<NavItem>
				<NavLink onclick={()=> goto(userURL(page.url.origin))}>User</NavLink>
			</NavItem>
			<NavItem>
				<NavLink onclick={() => goto(aboutURL(page.url.origin))}>About</NavLink>
			</NavItem>
		</Nav>
		<Nav navbar class="ms-auto">
			<NavItem class="me-3 d-none d-md-block">
				<NavLink onclick={aboutToggle}>
					{name.length > 40 ? `${name.substring(0, 35)}...` : name}
					<Icon name="info-circle" />
				</NavLink>
			</NavItem>
			<NavItem class="me-3">
				<FavoriteButton onclick={() => toggleFavorite()} isFavorite={favorite}>
					Favorite
				</FavoriteButton>
			</NavItem>
		</Nav>
	</Collapse>
</Navbar>

<Modal body header="Information" isOpen={aboutOpen} toggle={aboutToggle}>
	<Table>
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
	</Table>
</Modal>

<Toast bind:this={toast} />
