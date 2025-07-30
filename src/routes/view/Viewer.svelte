<script lang="ts">
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import type { EmblaCarouselType, EmblaEventType } from 'embla-carousel';

	import { Icon } from 'svelte-icon';
	import chevronLeft from '@mdi/svg/svg/chevron-left.svg?raw';
	import chevronRight from '@mdi/svg/svg/chevron-right.svg?raw';
	import Page from './Page.svelte';

	let { imageURLs = [], onIndexChange, startIndex } = $props();

	let pages: Page[] = $state(new Array(imageURLs.length));

	function slidesInView(emblaApi: EmblaCarouselType, eventName: EmblaEventType): void {
		if (eventName == 'slidesInView') {
			const progress = Math.max(...emblaApi.slidesInView());
			onIndexChange(progress);

			let len = pages.length
			let prev = progress -1;
			if (prev < 0) prev = len + prev;

			let next = progress +1;
			if (next >= len) next = len - prev;

			pages[prev].forceLoad()
			pages[next].forceLoad()
		}
	}

	let emblaApi: EmblaCarouselType;
	let options = { loop: true, startIndex };

	function onInit(event: any) {
		emblaApi = event.detail;
		emblaApi.on('slidesInView', slidesInView);
	}
</script>

<button
	class="btn text-gray-500/50 hover:text-gray-500 bg-transparent border-transparent shadow-none fixed inset-y-1/4 h-1/2 z-10 w-20 start-2"
	onclick={() => emblaApi?.scrollPrev()}
>
	<Icon data={chevronLeft}></Icon>
</button>

<button
	class="btn text-gray-500/50 hover:text-gray-500 bg-transparent border-transparent shadow-none fixed inset-y-1/4 h-1/2 z-10 w-20 end-2"
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
