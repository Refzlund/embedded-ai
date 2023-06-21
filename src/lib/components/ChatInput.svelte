<script lang='ts'>
	import { click } from '$lib/actions/click'
	import { processAI } from '$lib/process-ai'
	import settings from '$lib/stores/app-settings'
	import appState from '$lib/stores/app-state'
	import { chatSession } from '$lib/stores/chat'
	import type { OpenAI } from '$lib/types/openai-chat'
	import { OpenAIPOST, getModelMaxTokens } from '$lib/utils/openai-api'
	import { get, type Writable } from 'svelte/store'
	import { fly } from 'svelte/transition'
	

	const elements: Record<any, HTMLElement> = {}

	export let toggleProcessButton: HTMLElement | undefined
	
	$: toggleProcessButton && click(toggleProcessButton, toggleProcessing)

	function toggleProcessing() {
		console.log('here')
		if($appState.processingAI)
			cancelProcessing()
		else
			send()
	}

	function textAreaKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			if(event.ctrlKey || event.shiftKey || event.altKey || event.metaKey)
				return
			
			event.preventDefault()
			send()
		}
	}

	function send() {
		const newMessage = tryCreateUserMessage()
		if(!newMessage)
			return

		processAI($settings?.gptModel || 'gpt-3.5-turbo-0613', newMessage)
	}

	function cancelProcessing() {
		if(!$appState.processingAI)
			return
		$appState.processingAI = false
	}

	function tryCreateUserMessage() {
		if($appState.input?.length == 0 || $appState.processingAI)
			return null
		const model = $settings.gptModel
		if(!model)
			return null
		
		const newMessage = chatSession.newMessage(model, 'user', $appState.input.trim() || '')
		newMessage.calculateTokens()

		$appState.input = ''
		return newMessage
	}

	

</script>




<template lang='pug'>
	
	.input(
		in:fly={{y: 250, duration: 500}}
		out:fly={{y: 250, duration: 175}}
	)
		textarea(
			placeholder='Type a message...'
			rows=3
			autofocus
			bind:value={$appState.input}
			on:keydown={textAreaKeydown}
			bind:this={elements.input}
			disabled={!$settings?.apiKey || !$settings?.gptModel || $appState.processingAI}
		)

</template>




<style lang='scss'>
	
	.input {
		width: 100%;
		overflow-x: visible;
	}

	textarea {
		display: block;
		min-width: 100%;
		height: 100px;
		padding: 10px 20px;
		border: 1px solid hsla(227, 33%, 80%, .2);
		border-radius: 6px;
		background-color: hsl(227, 20%, 25%);
		color: white;
		font-size: 16px;
		line-height: 1.5;
		box-shadow: 0px 0px 14px hsla(0, 0%, 0%, 0.2);
		
		margin-top: 30px;
		resize: vertical;
		
		filter: grayscale(0) brightness(1);
		transition: filter .2s ease;

		&[disabled] {
			filter: grayscale(.1) brightness(.9);
			color: hsla(0, 0%, 100%, 0.5);
		}

		&:focus {
			outline: none;
			border-color: hsl(227, 33%, 80%);
		}

		&::placeholder {
			color: white;
			opacity: .5;
			font-style: italic;
		}
	}
	
</style>