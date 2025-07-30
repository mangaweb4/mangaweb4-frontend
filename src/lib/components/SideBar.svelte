<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { browseURL, tagURL, historyURL, userURL, aboutURL } from '$lib/routes';

	import { Icon } from 'svelte-icon';
	import library_books from '@material-design-icons/svg/sharp/library_books.svg?raw';
	import label from '@material-design-icons/svg/sharp/label.svg?raw';
	import history from '@material-design-icons/svg/sharp/history.svg?raw';
	import person from '@material-design-icons/svg/sharp/person.svg?raw';
	import info from '@material-design-icons/svg/sharp/info.svg?raw';

	let { children = undefined, showMenu = $bindable() } = $props();
</script>

<div class="drawer-side">
	<div class="drawer-overlay" onclick={() => (showMenu = false)}></div>
	<ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
		{@render children?.()}
		<ul class="list">
			<li class="p-4 pb-2 text-xs opacity-60 tracking-wide">Navigation</li>
			<li class="list-row">
				<button onclick={() => goto(browseURL(page.url.origin))}>
					<Icon data={library_books} />&nbsp;Browse items
				</button>
			</li>
			<li class="list-row">
				<button onclick={() => goto(tagURL(page.url.origin))}>
					<Icon data={label} />&nbsp;Tag list
				</button>
			</li>

			<li class="list-row">
				<button onclick={() => goto(historyURL(page.url.origin))}>
					<Icon data={history} />&nbsp;History
				</button>
			</li>
			<li class="list-row">
				<button onclick={() => goto(userURL(page.url.origin))}>
					<Icon data={person} />User
				</button>
			</li>
			<li class="list-row">
				<button onclick={() => goto(aboutURL(page.url.origin))}>
					<Icon data={info} />About
				</button>
			</li>
		</ul>
	</ul>
</div>
