<script lang="ts">
	import { Icon } from 'svelte-icon';

	import goIcon from '@mdi/svg/svg/page-next.svg?raw';
	import firstPageIcon from '@mdi/svg/svg/page-first.svg?raw';
	import previousPageIcon from '@mdi/svg/svg/chevron-left.svg?raw';
	import nextPageIcon from '@mdi/svg/svg/chevron-right.svg?raw';
	import lastPageIcon from '@mdi/svg/svg/page-last.svg?raw';
	import plusIcon from '@mdi/svg/svg/plus.svg?raw';
	import minusIcon from '@mdi/svg/svg/minus.svg?raw';
	import { goto } from '$app/navigation';

	let { currentPage = $bindable(0), totalPage = 0, createLink = (n: number) => {} } = $props();
	let customPage = $state(currentPage);

    let dialog: HTMLDialogElement;

    export function showModal(){
        dialog.showModal()
    }
</script>

<dialog class="modal modal-bottom" bind:this={dialog}>
	<div class="modal-box w-full max-w-[640px] mx-auto">
		<h3 class="text-lg font-bold">Move to page</h3>
		<div class="py-4 flex flex-col">
			<div class="join flex mt-3">
				<button class="join-item btn flex-none" onclick={() => goto(createLink(0))}>
					<Icon data={firstPageIcon} />
					<div class="text hidden sm:block">First</div></button
				>
				<button
					class="join-item btn flex-none"
					class:btn-disabled={currentPage - 1 < 0}
					onclick={() => goto(createLink(currentPage - 1))}
				>
					<Icon data={previousPageIcon} />
					<div class="text hidden sm:block">Previous</div>
				</button>
				<div class="join flex-1 label"><p>Current page: {currentPage}</p></div>
				<button
					class="join-item btn flex-none"
					class:btn-disabled={currentPage + 1 > totalPage - 1}
					onclick={() => goto(createLink(currentPage + 1))}
				>
					<Icon data={nextPageIcon} />
					<div class="text hidden sm:block">Next</div>
				</button>
				<button class="join-item btn" onclick={() => goto(createLink(totalPage - 1))}>
					<Icon data={lastPageIcon} />
					<div class="text hidden sm:block">Last</div>
				</button>
			</div>
			<div class="join flex mt-3">
                <div class="label join-item flex-none">
                    custom page
                </div>
				<button
					class="join-item flex-none btn"
					class:btn-disabled={customPage - 1 <= 0}
					onclick={() => (customPage = Math.max(customPage - 1, 0))}
				>
					<Icon data={minusIcon} />
				</button>
				<input
					type="number"
					inputmode="numeric"
					class="input join-item flex-1"
					bind:value={customPage}
					placeholder="page #"
					max={totalPage - 1}
					min={0}
				/>
				<button
					class="join-item btn flex-none"
					class:btn-disabled={customPage + 1 >= totalPage - 1}
					onclick={() => (customPage = Math.min(customPage + 1, totalPage - 1))}
				>
					<Icon data={plusIcon} />
				</button>

				<button class="join-item btn flex-none" onclick={() => goto(createLink(customPage))}>
					<Icon data={goIcon}></Icon>
                    <div class="text hidden sm:block">Go</div>
				</button>
			</div>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
