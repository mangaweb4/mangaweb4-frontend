<script lang="ts">
	import photo from '@mdi/svg/svg/timer-sand.svg?raw';
	import { Icon } from 'svelte-icon';
	interface Props {
		accessTime?: boolean;
	}

	let { accessTime }: Props = $props();
</script>

<div class="card bg-base-100 h-full shadow-xl">
	<div class="mt-0 mb-0">
		<div style="display:block; aspect-ratio: 1/1.414">
			<Icon
				class="card-img-top h-full"
				data={photo}
				color="gray"
				width="359"
				height="510"
				viewBox="0 -8 24 48"
			/>
		</div>
	</div>
	<div class="card-body">
		<div class="h-[4em] overflow-hidden">
			<div class="skeleton h-4 w-70 mb-1"></div>
			<div class="skeleton h-4 w-28"></div>
		</div>

		{#if accessTime}
			<div class="h-[2em] overflow-hidden">
				<div class="skeleton h-4 w-50"></div>
			</div>
		{/if}

		<div class="h-[2em] overflow-hidden">
			<div class="skeleton h-4 w-50 mb-1"></div>
		</div>
	</div>
</div>
