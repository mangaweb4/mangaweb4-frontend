<script lang="ts">
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import type { EmblaCarouselType, EmblaEventType } from 'embla-carousel';

	import { Icon } from 'svelte-icon';
	import prevIcon from '@mdi/svg/svg/chevron-left.svg?raw';
	import nextIcon from '@mdi/svg/svg/chevron-right.svg?raw';

	import Page from './Page.svelte';

	let {
		imageURLs = [],
		onIndexChange = (i: number) => {},
		onTapped = () => {},
		startIndex,
		grayscale = false,
		disableAnimation = false
	} = $props();

	let pages: Page[] = $state(new Array(imageURLs.length));
	let progress = $state(startIndex);

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
	let options = {
		loop: true,
		startIndex,
		watchDrag: () => {
			return !disableAnimation;
		}
	};

	let scrolling = false;

	function onInit(event: any) {
		emblaApi = event.detail;
		emblaApi.on('slidesInView', slidesInView);
		emblaApi.on('scroll', () => (scrolling = true));
		emblaApi.on('settle', () => (scrolling = false));

		emblaApi.on('pointerUp', () => {
			if (!scrolling) onTapped();
		});
	}

	export function moveToPage(p: number) {
		emblaApi.scrollTo(p, disableAnimation);
	}

	export function next() {
		emblaApi.scrollNext(disableAnimation);
	}

	export function previous() {
		emblaApi.scrollPrev(disableAnimation);
	}
</script>

<button
	class="cursor-pointer text-gray-500/50 hover:text-gray-500 absolute inset-y-1/2 -translate-y-1/2 h-1/2 z-10 w-20 start-2"
	onclick={() => previous()}
>
	<Icon data={prevIcon} class="mx-auto"></Icon>
</button>

<button
	class="cursor-pointer text-gray-500/50 hover:text-gray-500 absolute inset-y-1/2 -translate-y-1/2 h-1/2 z-10 w-20 end-2"
	onclick={() => next()}
>
	<Icon data={nextIcon} class="mx-auto"></Icon>
</button>

<div
	class="embla w-full h-full bg-base-300"
	use:emblaCarouselSvelte={{ options, plugins: [] }}
	onemblaInit={onInit}
>
	<div class="embla__container w-full h-full flex">
		{#each imageURLs as url, index}
			<div class="embla__slide w-full h-full flex grow-0 shrink-0">
				<Page
					alt="page-{index}"
					src={url}
					bind:this={pages[index]}
					{grayscale}
					onLoaded={() => {
						if (index - 1 >= 0) pages[index - 1].forceLoad();
						if (index + 1 < pages.length) pages[index + 1].forceLoad();
					}}
				/>
			</div>
		{/each}
	</div>
</div>
