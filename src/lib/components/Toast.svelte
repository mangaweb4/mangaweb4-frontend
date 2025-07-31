<script lang="ts">
	import { Icon } from 'svelte-icon';
	import informationOutline from '@mdi/svg/svg/information-outline.svg?raw';

	let messages: string[] = $state([]);

	export function add(message: string) {
		messages.push(message);

		setTimeout(() => messages.shift(), 5_000);
	}
</script>

<div class="toast">
	{#each messages as m}
		<div class="alert alert-info">
			<Icon data={informationOutline} /> <span>{m}</span>
		</div>
	{/each}
</div>
