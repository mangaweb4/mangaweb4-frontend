<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { aboutURL, browseURL, historyURL, tagURL, userURL } from '$lib/routes';
	import type { PageData } from './$types';
	import {
		Button,
		Collapse,
		Container,
		Dropdown,
		DropdownItem,
		DropdownMenu,
		DropdownToggle,
		Icon,
		Nav,
		NavItem,
		NavLink,
		Navbar,
		NavbarBrand,
		NavbarToggler,
		Table
	} from '@sveltestrap/sveltestrap';
	import Toast from '$lib/Toast.svelte';
	import ConfirmDialog from '$lib/ConfirmDialog.svelte';

	let navbarToggleOpen = $state(false);
	function handleUpdate(event: CustomEvent<boolean>) {
		navbarToggleOpen = event.detail;
	}

	interface Props {
		version?: string;
		data: PageData;
	}

	let { version = '', data }: Props = $props();

	let toast: Toast;
	let confirm: ConfirmDialog;

	function confirmUpdateLibrary() {
		confirm.show(
			'Update library',
			'The library will be updated. This will take sometime. Do you still wants to perform?',
			updateLibrary
		);
	}

	async function updateLibrary() {
		const url = new URL('/api/maintenance/update_library', page.url.origin);
		await fetch(url);
		toast.show(
			'Updating library',
			'Updating the library in progress. Please refresh after a few minutes.'
		);
	}

	function confirmPurgeCache() {
		confirm.show(
			'Purge cache',
			'Cache will be purged. This will take sometime. Do you still wants to perform?',
			purgeCache
		);
	}

	async function purgeCache() {
		const url = new URL('/api/maintenance/purge_cache', page.url.origin);
		await fetch(url);
		toast.show('Purging cache', 'Purging cache in progress. Please refresh after a few minutes.');
	}
</script>

<svelte:head>
	<title>About: Mangaweb 3</title>
</svelte:head>

<Navbar color="dark" dark expand="md" sticky={'top'}>
	<NavbarBrand href="/">About</NavbarBrand>
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
					<DropdownItem onclick={() => goto(tagURL(page.url.origin))}>
						<Icon name="tags-fill" class="me-3" />
						Tag list
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>
			<NavItem>
				<NavLink onclick={() => goto(historyURL(page.url.origin))}>History</NavLink>
			</NavItem>
			<NavItem>
				<NavLink onclick={() => goto(userURL(page.url.origin))}>User</NavLink>
			</NavItem>
			<NavItem>
				<NavLink onclick={() => goto(aboutURL(page.url.origin))}>About</NavLink>
			</NavItem>
		</Nav>
	</Collapse>
</Navbar>
<Container>
	<h1>MangaWeb 3</h1>

	<h6>Version {version}</h6>
	<p>&copy; Copyright 2021-2023 Wutipong Wongsakuldej.</p>
	<p>
		Permission is hereby granted, free of charge, to any person obtaining a copy of this software
		and associated documentation files (the “Software”), to deal in the Software without
		restriction, including without limitation the rights to use, copy, modify, merge, publish,
		distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the
		Software is furnished to do so, subject to the following conditions:
	</p>

	<p>
		The above copyright notice and this permission notice shall be included in all copies or
		substantial portions of the Software.
	</p>

	<p>
		THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
		BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
		NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
		DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	</p>

	<h6>Using API server: {data.basePath}</h6>

	<hr />
	<h3>Project Page</h3>
	<ul>
		<li>
			<a class="icon-link" href="https://github.com/wutipong/managaweb4-frontend">
				<Icon name="github" />Frontend
			</a>
		</li>
		<li>
			<a class="icon-link" href="https://github.com/wutipong/managaweb4-backtend">
				<Icon name="github" />Backend
			</a>
		</li>
	</ul>
	<hr />

	<h3>Maintenance</h3>

	<Table>
		<thead>
			<tr>
				<th colspan="2"> Maintenance Operations </th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td class="align-middle"> Update library. </td>
				<td>
					<Button color="danger" onclick={() => confirmUpdateLibrary()}>
						<Icon name="play-circle" class="me-3" />Run
					</Button>
				</td>
			</tr>
			<tr>
				<td class="align-middle"> Purge caches. </td>
				<td>
					<Button color="danger" onclick={() => confirmPurgeCache()}>
						<Icon name="play-circle" class="me-3" />Run
					</Button>
				</td>
			</tr>
		</tbody>
	</Table>
</Container>

<ConfirmDialog bind:this={confirm} />

<Toast bind:this={toast} />
