<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { aboutURL, browseURL, historyURL, tagURL, logoutURL, userURL } from '$lib/routes';
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
		NavbarToggler,
		Table
	} from '@sveltestrap/sveltestrap';
	import md5 from 'md5';

	let navbarToggleOpen = $state(false);

	function handleUpdate(event: CustomEvent<boolean>) {
		navbarToggleOpen = event.detail;
	}

	let { email, name } = page.data;
</script>

<svelte:head>
	<title>User: Mangaweb 4</title>
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

	<Button onclick={() => goto(logoutURL(page.url.origin))} class="mt-4" size="xl">Logout</Button>

	<div class="mt-4 mb-4">
		<h4>Information</h4>
		<Table>
			<thead>
				<tr>
					<th colspan="2"> User details </th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td class="align-middle"> User ID </td>
					<td>
						{page.data.userId}
					</td>
				</tr>
			</tbody>

			<thead>
				<tr>
					<th colspan="2"> Reading statistic </th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td class="align-middle"> # Read items </td>
					<td>
						{page.data.readItemCount} / {page.data.backend.itemCount}
					</td>
				</tr>
				<tr>
					<td class="align-middle"> # Favorite items </td>
					<td>
						{page.data.favoriteItemCount} / {page.data.backend.itemCount}
					</td>
				</tr>
				<tr>
					<td class="align-middle"> # Favorite tags </td>
					<td>
						{page.data.favoriteTagCount} / {page.data.backend.tagCount}
					</td>
				</tr>
			</tbody>
		</Table>
	</div>
</Container>
