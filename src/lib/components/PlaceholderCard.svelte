<script lang="ts">
	interface Props {
		accessTime?: boolean;
	}

	let { accessTime }: Props = $props();
</script>

<div class="card bg-base-100 h-full shadow-xl">
	<div class="mt-0 mb-0">
		<div class="aspect-[1/1.414] relative">
			<div class="absolute place-self-center inset-1/2 skeleton h-4 w-full h-full"></div>
		</div>
	</div>
	<div class="card-body">
		<div class="h-32 overflow-hidden">
			<div class="skeleton h-4 w-70 m-2 mx-auto"></div>
			<div class="skeleton h-4 w-50 m-2 mx-auto"></div>
			<div class="skeleton h-4 w-70 m-2 mx-auto"></div>
			<div class="skeleton h-4 w-28 m-2 mx-auto"></div>
		</div>

		{#if accessTime}
			<div class="divider"><div class="skeleton h-4 w-50"></div> </div>
			<div class="h-[2em] overflow-hidden">
				<div class="skeleton h-4 w-50"></div>
			</div>
		{/if}
	</div>
</div>
