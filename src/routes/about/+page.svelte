<script lang="ts">
	import { page } from '$app/state';
	import type { PageData } from './$types';
	import Toast from '$lib/components/Toast.svelte';
	import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';

	import { Icon } from 'svelte-icon';
	import goIcon from '@mdi/svg/svg/play-circle.svg?raw';
	import githubIcon from '@mdi/svg/svg/github.svg?raw';

	import NavBar from '$lib/components/NavBar.svelte';
	import Container from '$lib/components/Container.svelte';
	import Content from '$lib/components/Content.svelte';
	import SideBar from '$lib/components/SideBar.svelte';

	interface Props {
		version?: string;
		data: PageData;
	}

	let { data }: Props = $props();

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

		toast.add('Updating the library in progress. Please refresh after a few minutes.', 'info');
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
		toast.add('Purging cache in progress. Please refresh after a few minutes.', 'info');
	}

	function confirmPopulateTags() {
		confirm.show(
			'Repopulate tags',
			'Tags list will be updated. This will take sometime. Do you still wants to perform?',
			populateTags
		);
	}

	async function populateTags() {
		const url = new URL('/api/maintenance/populate_tags', page.url.origin);
		await fetch(url);
		toast.add('Re-populate tags in progress. Please refresh after a few minutes.', 'info');
	}

	let showMenu = $state(false);
</script>

<svelte:head>
	<title>About: Mangaweb 4</title>
</svelte:head>

<Container bind:showMenu>
	<Content>
		<NavBar bind:showMenu>
			<div class="text-xl">About</div>
		</NavBar>

		<div class="container mx-auto prose max-w-5xl mt-4">
			<h1>MangaWeb 4</h1>

			<a class="btn" href="https://github.com/mangaweb4">
				<Icon data={githubIcon} />&nbsp;Github
			</a>

			<div class="mt-4">
				<p>&copy; Copyright 2021-2025 Wutipong Wongsakuldej.</p>
				<p>
					Permission is hereby granted, free of charge, to any person obtaining a copy of this
					software and associated documentation files (the “Software”), to deal in the Software
					without restriction, including without limitation the rights to use, copy, modify, merge,
					publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
					to whom the Software is furnished to do so, subject to the following conditions:
				</p>

				<p>
					The above copyright notice and this permission notice shall be included in all copies or
					substantial portions of the Software.
				</p>

				<p>
					THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
					INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
					PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
					FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
					OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
					DEALINGS IN THE SOFTWARE.
				</p>
			</div>

			<hr />

			<div class="mt-4">
				<h2>Maintenance</h2>

				<table class="table">
					<thead>
						<tr>
							<th colspan="2"> Maintenance Operations </th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td class="align-middle"> Update library </td>
							<td>
								<button class="btn btn-warning" onclick={() => confirmUpdateLibrary()}>
									<Icon data={goIcon} class="fill-red-400 stroke-red-800" />&nbsp;Run
								</button>
							</td>
						</tr>
						<tr>
							<td class="align-middle"> Repopulate tags </td>
							<td>
								<button class="btn btn-warning" onclick={() => confirmPopulateTags()}>
									<Icon data={goIcon} class="fill-red-400 stroke-red-800" />&nbsp;Run
								</button>
							</td>
						</tr>
						<tr>
							<td class="align-middle"> Purge caches </td>
							<td>
								<button class="btn btn-warning" onclick={() => confirmPurgeCache()}>
									<Icon data={goIcon} class="fill-red-400 stroke-red-800" />&nbsp;Run
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<hr />

			<div class="mt-4 mb-4">
				<h2>Information</h2>
				<table class="table">
					<thead>
						<tr>
							<th colspan="2"> Services </th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td class="align-middle"> Frontend version </td>
							<td>
								{data.frontend.version}
							</td>
						</tr>
						<tr>
							<td class="align-middle"> Backend version </td>
							<td>
								{data.backend.version}
							</td>
						</tr>
					</tbody>
					<thead>
						<tr>
							<th colspan="2"> Manga information </th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td class="align-middle"> # items </td>
							<td>
								{data.backend.itemCount}
							</td>
						</tr>
						<tr>
							<td class="align-middle"> # tags </td>
							<td>
								{data.backend.tagCount}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</Content>
	<SideBar bind:showMenu />
</Container>

<ConfirmDialog bind:this={confirm} />

<Toast bind:this={toast} />
