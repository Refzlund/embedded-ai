<script lang='ts'>
	import 'highlight.js/styles/github-dark.css'
	import { Icon, icons } from '$lib/icons'
	import { tooltip } from '$lib/actions/tooltip'
	import { writable } from 'svelte/store'
	import { click } from '$lib/actions'
	import { chatSession } from '$lib/stores/chat'
	import { processAI } from '$lib/process-ai'
	import { applyMarkdown } from './markdown'
	import appSettings from '$lib/stores/app-settings'
	import { tick } from 'svelte'

	const elements: Record<string, HTMLElement> = {}

	export let 
		index: number = -1,
		human: boolean = true

	const newSession = chatSession.newSession
	$: messageInfos = $chatSession.messageInfos
	$: message = $newSession.getMessage(index)
	$: info = $messageInfos[index]
	$: branch = $chatSession.branches[info.branchIndex as number]
	
	let showOriginal = writable(false)
	let editing = writable(false)

	$: applyMarkdown(elements.inner, $message.content || '', $editing || $showOriginal), message
	
	function getEditContent() {
		const codes = elements.content.querySelectorAll('code') as NodeListOf<HTMLElement>
		let text = ''
		for (let i = 0; i < codes.length; i++) {
			if(i > 0)
				text += '\n'
			text += codes[i].innerText
		}
		return text
	}

	function onEditSave() {
		$message.content = getEditContent()
		$editing = false
	}

	function onRegenerate() {
		const model = $appSettings.gptModel
		if(!model)
			throw new Error('No GPT model selected')
		
		$editing = false
		const newMessage = chatSession.newMessage(model, 'user', getEditContent(), index)
		newMessage.calculateTokens()
		processAI(model, newMessage)
	}

	function onContinueFromHere() {
		const model = $appSettings.gptModel
		if(!model)
			throw new Error('No GPT model selected')
		
		$editing = false
		const newMessage = chatSession.newMessage(model, 'assistant', getEditContent(), index)
		newMessage.onAIDone()
	}

	function changeBranchIndex(change: number) {
		branch.active = (branch.active + change) % branch.indexes.length
		if(branch.active < 0)
			branch.active = branch.indexes.length - 1
		chatSession.reloadMessageSequence()
	}

	async function keydown(event: KeyboardEvent) {
		if(event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault()
			const selection = window.getSelection()
			if (!selection)
				return
			const range = selection.getRangeAt(0)
			const br1 = document.createElement('br')
			const br2 = document.createElement('br')
			range.deleteContents()
			range.insertNode(br1)
			range.insertNode(br2)
			range.setStartAfter(br2)
			range.setEndAfter(br2)
			// Don't leave an empty text node at the end.
			if (!/\S/.test(range.endContainer.textContent || '') && range.endContainer !== br1) {
				range.extractContents()
			}
		}
	}

</script>




<template lang='pug'>
	
	message-content(
		bind:this={elements.content} 
		class:editing={$editing}
		export:style
		contenteditable={$editing}
		on:keydown={keydown}
	)
		.buttons
			+if('!$editing')
				+if('branch')
					button.icon.regenerate.warn.branch(
						use:tooltip={{ text: 'Branch: ' + (branch.active + 1) + ' / ' + branch.indexes.length }}
						tabindex='-1'
						use:click={{
							leftClick: () => changeBranchIndex(1),
							rightClick: () => changeBranchIndex(-1)
						}}
					) {branch.active + 1}
				button.icon(
					use:tooltip={{ text: 'Edit message' }}
					tabindex='-1'
					use:click={() => {
						$editing = true
						$showOriginal = false
					}}
				) #[Icon(icon={icons.edit})]
				button.icon(
					use:tooltip={{ text: 'View raw message' }}
					tabindex='-1'
					use:click={() => $showOriginal = !$showOriginal}
				) #[Icon(icon={$showOriginal ? icons.eyeOff : icons.eye})]
			+if('$editing')
				+if('human')
					button.icon.regenerate.warn(
						use:tooltip={{ text: 'Save & Regenerate Response' }}
						tabindex='0'
						use:click={onRegenerate}
					) #[Icon(icon={icons.repeat})]
				+if('!human')
					button.icon.regenerate.warn(
						use:tooltip={{ text: 'Save & Continue from here' }}
						tabindex='0'
						use:click={onContinueFromHere}
					) #[Icon(icon={icons.arrowHookUpRight})]
				button.icon(
					use:tooltip={{ text: 'Cancel' }}
					tabindex='0'
					use:click={() => $editing = false}
				) #[Icon(icon={icons.x})]
				button.icon(
					use:tooltip={{ text: 'Save' }}
					tabindex='0'
					use:click={onEditSave}
				) #[Icon(icon={icons.checkmark})]
		inner(bind:this={elements.inner})

</template>




<style lang='scss'>

	.regenerate {
		margin-right: 15px;
	}

	.branch {
		opacity: .75;
		margin-right: -80px;
		transition: margin-right .1s ease;
		border: transparent;
	}

	inner {
		display: contents;
	}

	message-content {
		button {
			opacity: 0;
		}
		&:hover {
			.branch {
				margin-right: 15px;
				border: 2px solid c(primary);
			}
			button {
				opacity: .75;
				&:hover {
					opacity: 1;
				}
			}
		}
	}

	.buttons {
		position: absolute;
		top: 15px;
		right: 15px;
		display: flex;
		gap: 5px;
	}

	button {
		min-height: auto;
		height: 34px;
		padding: 0;
		align-items: center;
		justify-content: center;
		border: 2px solid c(primary);
		background-color: v(message_background, hsl(227, 22%, 15%));
		box-shadow: none;
		transition: opacity .1s ease;
		color: var.Lightness(primary, 50%);
		z-index: 2;
		min-width: auto;
		width: 36px;

		&:hover {
			background-color: c(primary);
			color: white;
		}

		:global svg {
			font-size: 20px;
		}
	}

	message-content {
		position: relative;
		white-space: pre-wrap;
		display: flex;
		flex-direction: column;
		gap: 14px;
		color: hsla(0, 0%, 100%, .85);
		background-color: v(message_background, hsl(227, 22%, 15%));
		padding: 20px 20px;
		border-radius: 6px;
		border: 1px solid hsla(227, 33%, 80%, .2);
		cursor: text;

		&:focus {
			outline: none;
		}

		&.editing {
			border-color: red;
		}

		&:has(.show-original) {
			background-color: hsl(216, 28%, 7%);
		}

		$w: calc(100vw - v(chat-padding) * 2);
		max-width: $w;
		width: $w;
		min-width: $w;
	}

	
	
</style>