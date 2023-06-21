<script lang='ts'>
	import electron from '$lib/stores/electron'
	import ChatInput from './ChatInput.svelte'
	import Stripemenu from './Stripemenu'
	import Messages from './Messages.svelte'
	
	const elements: Record<any, HTMLElement> = {}

	$: {
		if($electron.show) {
			elements.input?.focus()
		}
	}

</script>




<template lang='pug'>
	
	chat(
		tabindex=0
		bind:this={elements.chat}
		role='application'
	)
		+if('$electron.show')
			Messages
			ChatInput(
				toggleProcessButton={elements.process}
			)
			Stripemenu({elements})
			

</template>




<style lang='scss'>
	
	chat {
		display: grid;
		grid-template-rows: 1fr min-content min-content;
		grid-template-columns: 1fr;
		flex-direction: column;
		justify-content: flex-end;
		height: 100%;
		gap: 12px;
		overflow: hidden;

		min-width: 100%;
		max-width: 100%;
		width: 100%;

		padding: v(chat-padding);
		padding-top: 0px;

		&:focus {
			outline: none;
		}
	}

</style>