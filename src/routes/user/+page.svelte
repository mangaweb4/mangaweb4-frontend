<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { aboutURL, browseURL, historyURL, tagURL, userURL } from '$lib/routes';
	import {
		Button,
		Collapse,
		Container,
		Dropdown,
		DropdownItem,
		DropdownMenu,
		DropdownToggle,
		Icon,
		Image,
		Nav,
		NavItem,
		NavLink,
		Navbar,
		NavbarBrand,
		NavbarToggler
	} from '@sveltestrap/sveltestrap';
	import md5 from 'md5';

	let navbarToggleOpen = $state(false);

	function handleUpdate(event: CustomEvent<boolean>) {
		navbarToggleOpen = event.detail;
	}

	let { email, name, logoutURL } = page.data;
</script>

<svelte:head>
	<title>User: Mangaweb 3</title>
</svelte:head>

<Navbar color="dark" dark expand="md" sticky={'top'}>
	<NavbarBrand href="/">User</NavbarBrand>
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
	<Image
		src="https://www.gravatar.com/avatar/{md5(email)}"
		class="rounded-circle mt-4"
		width="80"
		height="80"
	/>

	<h2 class="mt-4">{name}</h2>
	<p><b>Email</b> {email}</p>

	{#if logoutURL != ''}
		<Button href={logoutURL} class="mt-4" size="xl">Logout</Button>
	{/if}
</Container>
