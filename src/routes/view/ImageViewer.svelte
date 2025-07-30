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

<div class="carousel slide w-full h-full" id="carouselControl">
	<div class="carousel-inner w-full h-full" id="carousel" style="width:100%; height:100%;">
		{#each imageURLs as url, index}
			<div class="carousel-item w-full h-full" class:active={index === (startIndex ?? 0)}>
				<div class="w-full h-full d-flex flex-col">
					<PageImage alt="page {index}" src={new URL(url)} bind:this={imgs[index]} />
				</div>
			</div>
		{/each}
	</div>
	<button class="carousel-control-prev" data-bs-target="#carouselControl" data-bs-slide="prev">
		<span class="carousel-control-prev-icon" aria-hidden="true"></span>
		<span class="visually-hidden">Previous</span>
	</button>
	<button class="carousel-control-next" data-bs-target="#carouselControl" data-bs-slide="next">
		<span class="carousel-control-next-icon" aria-hidden="true"></span>
		<span class="visually-hidden">Next</span>
	</button>
</div>
