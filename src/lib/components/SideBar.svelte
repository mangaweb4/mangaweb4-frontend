<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { browseURL, tagURL, historyURL, userURL, aboutURL } from '$lib/routes';

	import { Icon } from 'svelte-icon';
	import bookshelf from '@mdi/svg/svg/bookshelf.svg?raw';
	import tag_multiple from '@mdi/svg/svg/tag-multiple.svg?raw';
	import history from '@mdi/svg/svg/history.svg?raw';
	import account from '@mdi/svg/svg/account.svg?raw';
	import information from '@mdi/svg/svg/information.svg?raw';

	let { children = undefined, showMenu = $bindable() } = $props();
</script>

<div class="drawer-side">
	<div class="drawer-overlay" role="none" onkeydown={() => (showMenu = false)} onclick={() => (showMenu = false)}></div>
	<ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
		{@render children?.()}

		<li class="menu-title">Navigation</li>
			
		<ul class="list">
			<li class="list-row">
				<button onclick={() => goto(browseURL(page.url.origin))}>
					<Icon data={bookshelf} />&nbsp;Browse items
				</button>
			</li>
			<li class="list-row">
				<button onclick={() => goto(tagURL(page.url.origin))}>
					<Icon data={tag_multiple} />&nbsp;Tag list
				</button>
			</li>

			<li class="list-row">
				<button onclick={() => goto(historyURL(page.url.origin))}>
					<Icon data={history} />&nbsp;History
				</button>
			</li>
			<li class="list-row">
				<button onclick={() => goto(userURL(page.url.origin))}>
					<Icon data={account} />User
				</button>
			</li>
			<li class="list-row">
				<button onclick={() => goto(aboutURL(page.url.origin))}>
					<Icon data={information} />About
				</button>
			</li>
		</ul>
	</ul>
</div>
