<script lang="ts">
	import { Icon } from 'svelte-icon';
	import infoIcon from '@mdi/svg/svg/information-outline.svg?raw';
	import successIcon from '@mdi/svg/svg/check.svg?raw';
	import warningIcon from '@mdi/svg/svg/alert-circle-outline.svg?raw';
	import errorIcon from '@mdi/svg/svg/alert-circle.svg?raw';

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
	{#each messages as m (m.id)}
		<div
			class="alert"
			class:alert-info={m.type == 'info'}
			class:alert-success={m.type == 'success'}
			class:alert-warning={m.type == 'warning'}
			class:alert-error={m.type == 'error'}
		>
			{#if m.type == 'info'}
				<Icon data={infoIcon} />
			{:else if m.type == 'success'}
				<Icon data={successIcon} />
			{:else if m.type == 'warning'}
				<Icon data={warningIcon} />
			{:else if m.type == 'error'}
				<Icon data={errorIcon} />
			{/if}
			<span>{m.body}</span>
		</div>
	{/each}
</div>
