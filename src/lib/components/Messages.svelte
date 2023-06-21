<script lang='ts'>
	
	import { fly } from 'svelte/transition'
	import { autoScroll } from '$lib/actions/auto-scroll'
	import { get, writable } from 'svelte/store'
	import { onMount } from 'svelte'
	import { asyncRequestAnimationFrame } from '$lib/stores/async'
	import { chatSession } from '$lib/stores/chat'
	import { tooltip } from '$lib/actions/tooltip'
	import Message from './Message'

	$: messageSequence = $chatSession.messageSequence
	const elements: Record<any, HTMLElement> = {}

	const messageScroll = writable(Infinity)
	
	let mounted = false
	onMount(async () => {
		for (let i = 0; i < 3; i++) {
			elements.messages.scrollTo({ top: elements.messages.scrollHeight, behavior: 'auto' })
			await asyncRequestAnimationFrame()
		}
	})
	
</script>




<template lang='pug'>
	
	messages(
		bind:this={elements.messages}
		in:fly={{y: -200, duration: 500}}
		out:fly={{y: -200, duration: 175}}
		use:autoScroll={{threshold: 350, scrollSpeed: 3.5, scrollTop: messageScroll}}
	)
		+if('$messageSequence')
			+each('$messageSequence as index')
				+const('msg = get(chatSession.getMessage(index))')
				+if('msg.role === "user"')
					Message(
						{index}
						--message_background='var(--color-user-message)'
					)
				+if('msg.role === "assistant"')
					Message(
						{index}
						human=false
						--message_background='var(--color-ai-message)'
					)

</template>




<style lang='scss'>
	
	messages {
		display: flex;
		flex-direction: column;
		gap: 12px;
		width: 100%;
		overflow-x: hidden;
		overflow-y: scroll;
		height: 100%;
		min-width: max-content;
		padding-top: 50px;

		:global(> *) {
			display: block;
			width: 100%;
			height: max-content;
			overflow: visible;
			min-width: 100%;

			&:nth-child(1) {
				margin-top: auto;
			}
		}
		
		// Hide scrollbar
		&::-webkit-scrollbar {
			width: 0px;
			background: transparent;
		}
	}
	
</style>