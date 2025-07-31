<script lang="ts">
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import type { EmblaCarouselType, EmblaEventType } from 'embla-carousel';

	import { Icon } from 'svelte-icon';
	import chevronLeft from '@mdi/svg/svg/chevron-left.svg?raw';
	import chevronRight from '@mdi/svg/svg/chevron-right.svg?raw';
	import chevronUp from '@mdi/svg/svg/chevron-up.svg?raw';

	import Page from './Page.svelte';

	let { imageURLs = [], onIndexChange, startIndex } = $props();

	let pages: Page[] = $state(new Array(imageURLs.length));
	let progress = $state(0);

	function slidesInView(emblaApi: EmblaCarouselType, eventName: EmblaEventType): void {
		if (eventName == 'slidesInView') {
			progress = emblaApi.selectedScrollSnap();
			onIndexChange(progress);

			let len = pages.length;
			let prev = progress - 1;
			if (prev < 0) prev = len + prev;

			let next = progress + 1;
			if (next >= len) next = len - prev;

			pages[prev].forceLoad();
			pages[next].forceLoad();
		}
	}

	let emblaApi: EmblaCarouselType;
	let options = { loop: true, startIndex };

	function onInit(event: any) {
		emblaApi = event.detail;
		emblaApi.on('slidesInView', slidesInView);
	}

	let pageScroll: HTMLDialogElement;
</script>

<button
	class="btn text-gray-500/50 hover:text-gray-500 bg-transparent border-transparent shadow-none fixed inset-y-1/2 -translate-y-1/2 h-1/2 z-10 w-20 start-2"
	onclick={() => emblaApi?.scrollPrev()}
>
	<Icon data={chevronLeft}></Icon>
</button>

<button
	class="btn text-gray-500/50 hover:text-gray-500 bg-transparent border-transparent shadow-none fixed inset-y-1/2 -translate-y-1/2 h-1/2 z-10 w-20 end-2"
	onclick={() => emblaApi?.scrollNext()}
>
	<Icon data={chevronRight}></Icon>
</button>

<div
	class="embla w-full h-full"
	use:emblaCarouselSvelte={{ options, plugins: [] }}
	onemblaInit={onInit}
>
	<div class="embla__container w-full h-full flex">
		{#each imageURLs as url, index}
			<div class="embla__slide w-full h-full flex grow-0 shrink-0">
				<Page alt="page-{index}" src={url} bind:this={pages[index]} />
			</div>
		{/each}
	</div>
</div>

<button
	class="btn text-gray-500/50 hover:text-gray-500 bg-transparent border-transparent shadow-none fixed inset-x-1/2 -translate-x-1/2 w-1/2 z-10 h-20 bottom-2"
	onclick={() => pageScroll.showModal()}><Icon data={chevronUp}></Icon></button
>

<dialog class="modal modal-bottom" bind:this={pageScroll}>
	<div class="modal-box w-full max-w-[1024px] mx-auto">
		<h3 class="text-lg font-bold">Move to page</h3>
		<p class="py-4">
			<input
				type="range"
				class="w-full"
				min="0"
				max={pages.length - 1}
				bind:value={progress}
				onchange={(e: any) => emblaApi.scrollTo(e.target.value)}
			/>
			{progress + 1} of {pages.length}
		</p>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
