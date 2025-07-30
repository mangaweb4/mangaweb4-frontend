<script lang="ts">
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import type { EmblaCarouselType, EmblaEventType } from 'embla-carousel';

	import { Icon } from 'svelte-icon';
	import chevronLeft from '@mdi/svg/svg/chevron-left.svg?raw';
	import chevronRight from '@mdi/svg/svg/chevron-right.svg?raw';

	let { imageURLs = [], onIndexChange, startIndex } = $props();

	function slidesInView(emblaApi: EmblaCarouselType, eventName: EmblaEventType): void {
		if (eventName == 'slidesInView') {
			const progress = Math.max(...emblaApi.slidesInView());
			onIndexChange(progress);
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
				<img
					alt="page-{index}"
					class="w-full h-full"
					style="object-fit:contain;max-width:100%;max-height:100%"
					src={new URL(url).toString()}
				/>
			</div>
		{/each}
	</div>
</div>

<!--
<script lang="ts">
	import { onMount } from 'svelte';
	import PageImage from './PageImage.svelte';

	interface Props {
		imageURLs?: string[];
		onIndexChange: Function;
		startIndex?: number;
	}

	let { imageURLs = [], onIndexChange, startIndex }: Props = $props();

	let carousel: bootstrap.Carousel;
	let imgs: PageImage[] = $state([]);

	onMount(async () => {
		const bootstrap = await import('bootstrap');
		let carouselControl = document.querySelector('#carouselControl');

		carousel = new bootstrap.Carousel(carouselControl as Element, {
			interval: false
		});

		carouselControl?.addEventListener('slide.bs.carousel', (e) => {
			if (onIndexChange) {
				onIndexChange(e.to);
			}

			const next = Math.min(e.to + 1, imgs.length - 1);
			imgs[next]?.forceLoad();

			const prev = Math.min(e.to - 1, imgs.length - 1);
			imgs[prev]?.forceLoad();
		});

		imgs[0]?.forceLoad();
		imgs[1]?.forceLoad();
		imgs[imgs.length - 1]?.forceLoad();
	});

	export function advance(n: number) {
		carousel.to(n);
	}
</script>

<div class="carousel w-full h-full block" id="carouselControl">
	{#each imageURLs as url, index}
		<div class="carousel-item h-full m-0">
			<img
			class="w-full"
			style="object-fit:contain;max-width:100%;max-height:100%"
			 src={new URL(url).toString()} />
		</div>

		<div class="carousel-item w-full h-full" class:active={index === (startIndex ?? 0)}>
			<div class="w-full h-full d-flex flex-col">
				<PageImage alt="page {index}" src={new URL(url)} bind:this={imgs[index]} />
			</div>
		</div>
	{/each}

	<button class="carousel-control-prev" data-bs-target="#carouselControl" data-bs-slide="prev">
		<span class="carousel-control-prev-icon" aria-hidden="true"></span>
		<span class="visually-hidden">Previous</span>
	</button>
	<button class="carousel-control-next" data-bs-target="#carouselControl" data-bs-slide="next">
		<span class="carousel-control-next-icon" aria-hidden="true"></span>
		<span class="visually-hidden">Next</span>
	</button>

</div>
-->

<!-- <button
	class="btn btn-ghost fixed start-0 top-1/2 z-10"
	onclick={() => swiperEl?.swiper.slidePrev()}>Prev</button
>

<button
	class="btn btn-ghost fixed end-0 inset-y-1/2 z-10"
	onclick={() => swiperEl?.swiper.slideNext()}>Next</button
> -->
