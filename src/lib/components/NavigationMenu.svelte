<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { browseURL, tagURL, historyURL, userURL, aboutURL } from '$lib/routes';
	import {
		Dropdown,
		DropdownItem,
		DropdownMenu,
		DropdownToggle,
		Nav,
		NavItem,
		NavLink
	} from '@sveltestrap/sveltestrap';

	import { Icon } from 'svelte-icon';
	import library_books from '@material-design-icons/svg/round/library_books.svg?raw';
	import label from '@material-design-icons/svg/round/label.svg?raw';
</script>

<Nav navbar>
	<Dropdown nav inNavbar>
		<DropdownToggle nav caret>Browse</DropdownToggle>
		<DropdownMenu end>
			<DropdownItem onclick={() => goto(browseURL(page.url.origin))}>
				<Icon data={library_books} class="me-3" />
				All items
			</DropdownItem>
			<DropdownItem onclick={() => goto(tagURL(page.url.origin))}>
				<Icon data={label} class="me-3" />
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
