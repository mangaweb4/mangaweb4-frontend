<script lang="ts">
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import type { EmblaCarouselType, EmblaEventType } from 'embla-carousel';
	import { bindKey } from '@rwh/keystrokes';
	import { onMount } from 'svelte';
	import Hammer from 'hammerjs';

	import { Icon } from 'svelte-icon';
	import prevIcon from '@mdi/svg/svg/chevron-left.svg?raw';
	import nextIcon from '@mdi/svg/svg/chevron-right.svg?raw';

	import Page from './Page.svelte';

	onMount(() => {
		bindKey(['ArrowLeft', 'ArrowUp', 'PageUp'], (e) => {
			e.preventDefault();
			previous();
		});
		bindKey(['ArrowRight', 'ArrowDown', 'PageDown'], (e) => {
			e.preventDefault();
			next();
		});
	});

	let {
		imageURLs = [],
		onIndexChange = (_i: number) => {},
		onTapped = () => {},
		startIndex,
		grayscale = false,
		disableAnimation = false,
		disabled = $bindable(false)
	} = $props();

	let pages: Page[] = $state(() => Array(imageURLs.length));
	let progress = $derived(startIndex);

	function hammerJsAttachment(element: HTMLElement) {
		let manager = new Hammer.Manager(element);
		let swipe = new Hammer.Swipe();
		manager.add(swipe);
		manager.on('swipeleft', () => {
			if (disabled) return;
			if (!disableAnimation) return;
			next();
		});

		manager.on('swiperight', () => {
			if (disabled) return;
			if (!disableAnimation) return;
			previous();
		});

		let tap = new Hammer.Tap();
		manager.add(tap);
		manager.on('tap', () => {
			onTapped();
		});
	}

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
		startIndex: (() => startIndex)(), // use initial value here since the carousel is initialized once anyway.
		watchDrag: () => {
			return !disableAnimation && !disabled;
		}
	};

	function onEmblaInit(event: CustomEvent<EmblaCarouselType>) {
		emblaApi = event.detail;
		emblaApi.on('slidesInView', slidesInView);
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
	class="absolute inset-y-1/2 start-2 z-10 h-1/2 w-20 -translate-y-1/2 cursor-pointer text-gray-500/50 hover:text-gray-500"
	onclick={() => previous()}
	{disabled}
>
	<Icon data={prevIcon} class="mx-auto"></Icon>
</button>

<button
	class="absolute inset-y-1/2 end-2 z-10 h-1/2 w-20 -translate-y-1/2 cursor-pointer text-gray-500/50 hover:text-gray-500"
	onclick={() => next()}
	{disabled}
>
	<Icon data={nextIcon} class="mx-auto"></Icon>
</button>

<div
	class="embla bg-base-300 h-full w-full"
	class:brightness-50={disabled}
	use:emblaCarouselSvelte={{ options, plugins: [] }}
	onemblaInit={onEmblaInit}
	{@attach hammerJsAttachment}
>
	<div class="embla__container flex h-full w-full">
		{#each imageURLs as url, index (index)}
			<div class="embla__slide flex h-full w-full shrink-0 grow-0">
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
