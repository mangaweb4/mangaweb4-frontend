<script lang="ts">
	import { Icon } from 'svelte-icon';
	import informationOutline from '@mdi/svg/svg/information-outline.svg?raw';
	import check from '@mdi/svg/svg/check.svg?raw';
	import alertCircleOutline from '@mdi/svg/svg/alert-circle-outline.svg?raw';
	import alertCircle from '@mdi/svg/svg/alert-circle.svg?raw';

	let messages: {
		body: string;
		type: 'info' | 'success' | 'warning' | 'error';
	}[] = $state([]);

	export function add(body: string, type: 'info' | 'success' | 'warning' | 'error') {
		messages.push({ body, type });

		setTimeout(() => messages.shift(), 5_000);
	}
</script>

<div class="toast z-20">
	{#each messages as m}
		<div
			class="alert"
			class:alert-info={m.type == 'info'}
			class:alert-success={m.type == 'success'}
			class:alert-warning={m.type == 'warning'}
			class:alert-error={m.type == 'error'}
		>
			{#if m.type == 'info'}
				<Icon data={informationOutline} />
			{:else if m.type == 'success'}
				<Icon data={check} />
			{:else if m.type == 'warning'}
				<Icon data={alertCircleOutline} />
			{:else if m.type == 'error'}
				<Icon data={alertCircle} />
			{/if}
			<span>{m.body}</span>
		</div>
	{/each}
</div>
