<script lang="ts">
	interface Props {
		accessTime?: boolean;
	}

	let { accessTime }: Props = $props();
</script>

<div class="card bg-base-100 h-full shadow-xl">
	<div class="mt-0 mb-0">
		<div class="relative aspect-[1/1.414]">
			<div class="skeleton absolute start-0 top-0 h-full w-full place-self-center"></div>
		</div>
	</div>
	<div class="card-body">
		<div class="h-32 overflow-hidden">
			<div class="skeleton m-2 mx-auto h-4 w-70"></div>
			<div class="skeleton m-2 mx-auto h-4 w-50"></div>
			<div class="skeleton m-2 mx-auto h-4 w-70"></div>
			<div class="skeleton m-2 mx-auto h-4 w-28"></div>
		</div>

		{#if accessTime}
			<div class="divider"><div class="skeleton h-4 w-50"></div></div>
			<div class="h-[2em] overflow-hidden">
				<div class="skeleton h-4 w-50"></div>
			</div>
		{/if}
	</div>
</div>
