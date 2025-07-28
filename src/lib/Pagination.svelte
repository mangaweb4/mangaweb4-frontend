<script lang="ts">
	import { page } from '$app/state';
	import {
		Button,
		Container,
		Icon,
		Input,
		InputGroup,
		Modal,
		ModalBody,
		ModalFooter,
		Offcanvas,
		Pagination,
		PaginationItem,
		PaginationLink
	} from '@sveltestrap/sveltestrap';
	import { goto } from '$app/navigation';

	interface Props {
		currentPage?: number;
		totalPage?: number;
		pageToShow?: number;
	}

	let { currentPage = 0, totalPage = 1, pageToShow = 5 }: Props = $props();

	let first = $state(0);
	let last = $derived(totalPage - 1);

	let customOpen = $state(false);
	let customPage = $state(currentPage);

	let pageNumbers: number[] = $state([]);
	$effect(() => {
		if (totalPage != 0) {
			let pages: number[] = [];

			const halfCount = Math.floor(pageToShow / 2);

			const startPage = currentPage - halfCount;
			const endPage = startPage + pageToShow;

			for (let i = startPage; i < endPage; i++) {
				if (i < 0 || i >= totalPage) continue;
				pages = [...pages, i];
			}

			pageNumbers = pages;
		}
	});

	function gotoPage(i: number) {
		goto(createLink(i));
	}

	function createLink(i: number): URL {
		let url = new URL(page.url);
		url.searchParams.set('page', i.toString());

		return url;
	}
</script>

<Pagination >
	<PaginationItem>
		<PaginationLink first href={createLink(first).toString()} />
	</PaginationItem>

	{#each pageNumbers as i}
		<PaginationItem active={i === currentPage}>
			<PaginationLink href={createLink(i).toString()}>
				{i}
			</PaginationLink>
		</PaginationItem>
	{/each}

	<PaginationItem>
		<PaginationLink onclick={() => (customOpen = true)}>
			<Icon name="hash"></Icon>
		</PaginationLink>
	</PaginationItem>

	<PaginationItem>
		<PaginationLink last href={createLink(last).toString()} />
	</PaginationItem>
</Pagination>

<Offcanvas
	isOpen={customOpen}
	toggle={() => (customOpen = !customOpen)}
	header="Go to page"
	placement="bottom"
	
>
	<Container class="ms-auto me-auto" style="min-width: 10em; max-width: 50em;">
		<InputGroup>
			<Button onclick={() => (customPage = 0)}>0</Button>
			<Input
				type="number"
				bind:value={customPage}
				placeholder="page #"
				max={totalPage - 1}
				min={0}
			/>
			<Button onclick={() => (customPage = totalPage - 1)}>{totalPage - 1}</Button>
			<Button onclick={() => gotoPage(customPage)}>
				<Icon name="box-arrow-right"></Icon>
			</Button>
		</InputGroup>
	</Container>
</Offcanvas>
