<script lang="ts">
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import type { EmblaCarouselType, EmblaEventType } from 'embla-carousel';

	import { Icon } from 'svelte-icon';
	import prevIcon from '@mdi/svg/svg/chevron-left.svg?raw';
	import nextIcon from '@mdi/svg/svg/chevron-right.svg?raw';
	import firstIcon from '@mdi/svg/svg/page-first.svg?raw';
	import lastIcon from '@mdi/svg/svg/page-last.svg?raw';

	import Page from './Page.svelte';

	let { imageURLs = [], onIndexChange, startIndex, grayscale = false, disableAnimation=false } = $props();

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
	let options = { loop: true, startIndex };

	function onInit(event: any) {
		emblaApi = event.detail;
		emblaApi.on('slidesInView', slidesInView);
	}

	let pageScroll: HTMLDialogElement;
</script>

<button
	class="cursor-pointer text-gray-500/50 hover:text-gray-500 absolute inset-y-1/2 -translate-y-1/2 h-1/2 z-10 w-20 start-2"
	onclick={() => emblaApi?.scrollPrev(disableAnimation)}
>
	<Icon data={prevIcon} class="mx-auto"></Icon>
</button>

<button
	class="cursor-pointer text-gray-500/50 hover:text-gray-500 absolute inset-y-1/2 -translate-y-1/2 h-1/2 z-10 w-20 end-2"
	onclick={() => emblaApi?.scrollNext(disableAnimation)}
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
				<Page alt="page-{index}" src={url} bind:this={pages[index]} grayscale={grayscale}/>
			</div>
		{/each}
	</div>
</div>

<button
	class="cursor-pointer absolute w-full h-20 bottom-2"
	onclick={() => pageScroll.showModal()}
	aria-label='toggle-page-scroll'
>
</button>

<dialog class="modal modal-bottom" bind:this={pageScroll}>
	<div class="modal-box w-full max-w-[1024px] mx-auto">
		<h3 class="text-lg font-bold">Move to page</h3>
		<div class="flex flex-row mt-4">
			<button 
				class="btn flex-none" 
				onclick={()=>{emblaApi.scrollTo(0, disableAnimation) }}
			>
				<Icon data={firstIcon}/>
			</button>
			<button 
				class="btn flex-none" 
				onclick={()=>{emblaApi.scrollPrev(disableAnimation) }}
			>
				<Icon data={prevIcon}/>
			</button>
			<input
				type="range"
				class="range flex-1 place-self-center mx-2" 
				min="0"
				max={pages.length - 1}
				bind:value={progress}
				onchange={(e: any) => emblaApi.scrollTo(e.target.value, disableAnimation)}
			/>
			<button 
				class="btn flex-none" 
				onclick={()=>{emblaApi.scrollNext(disableAnimation) }}
			>
				<Icon data={nextIcon}/>
			</button>
			<button 
				class="btn flex-none" 
				onclick={()=>{emblaApi.scrollTo(pages.length - 1, disableAnimation) }}
			>
				<Icon data={lastIcon}/>
			</button>
		</div>
		<p class="mt-2">
			{progress + 1} of {pages.length}
		</p>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
