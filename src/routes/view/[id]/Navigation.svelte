<script lang="ts">
	import { Icon } from 'svelte-icon';
	import prevIcon from '@mdi/svg/svg/chevron-left.svg?raw';
	import nextIcon from '@mdi/svg/svg/chevron-right.svg?raw';
	import firstIcon from '@mdi/svg/svg/page-first.svg?raw';
	import lastIcon from '@mdi/svg/svg/page-last.svg?raw';

	let {
		length,
		current = $bindable(0),
		show = $bindable(true),
		onMovedToPage = (i: number) => {},
		onPrevious = () => {},
		onNext = () => {}
	} = $props();
</script>

<div class="w-full bg-base-100 fixed h-[10em] bottom-0" hidden={!show}>
	<div class="mx-auto max-w-5xl p-3">
		<h3 class="text-lg font-bold">Move to page</h3>
		<div class="flex flex-row mt-4">
			<button
				class="btn flex-none"
				onclick={() => {
					onMovedToPage(0);
				}}
			>
				<Icon data={firstIcon} />
			</button>
			<button
				class="btn flex-none"
				onclick={() => {
					onPrevious();
				}}
			>
				<Icon data={prevIcon} />
			</button>
			<input
				type="range"
				class="range flex-1 place-self-center mx-2"
				min="0"
				max={length}
				bind:value={current}
				onchange={(e: any) => onMovedToPage(e.target.value)}
			/>
			<button
				class="btn flex-none"
				onclick={() => {
					onNext();
				}}
			>
				<Icon data={nextIcon} />
			</button>
			<button
				class="btn flex-none"
				onclick={() => {
					onMovedToPage(length - 1);
				}}
			>
				<Icon data={lastIcon} />
			</button>
		</div>
		<p class="mt-2">
			{current + 1} of {length}
		</p>
	</div>
</div>
