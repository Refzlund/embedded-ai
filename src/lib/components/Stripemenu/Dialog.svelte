<script lang='ts'>
	import { onMount } from 'svelte'
	import { writable } from 'svelte/store'
	import settings, { applyUnsetSettings } from '$lib/stores/app-settings'
	import { tooltip } from '$lib/actions/tooltip'

	const fs: typeof import('fs/promises') = require('fs/promises')
	const { shell }: typeof import('electron') = require('electron')
	
	let dialog: HTMLDialogElement 
	export let open = true

	let input: HTMLInputElement

	$: {
		if(dialog) {
			open ? dialog.showModal() : dialog.close()
			input.blur()
		}
		
	}

	
	const apiKey = writable($settings?.apiKey || '')

	let revealKey = false

	settings.subscribe(v => {
		$apiKey = v?.apiKey || $apiKey
		revealKey = !$apiKey
	})

	async function save() {
		if(!$settings)
			return
		$settings.apiKey = $apiKey == '' ? undefined : $apiKey
		settings.saveSettings()
		applyUnsetSettings()
		close()
	}

	function close() {
		open = false
		revealKey = !$settings?.apiKey
		
	}

</script>




<template lang='pug'>
	
	dialog(bind:this={dialog})
		h3 Setting the API key
		label(for='apikey') API key
		.blur-input(
			class:blur={!revealKey}
		)
			.text(
				on:click={() => revealKey = true}
			) Click to reveal
			input(
				bind:this={input}
				id='apikey'
				type='text' 
				bind:value={$apiKey}
			)
		.link Can be found at your 
			a(
				use:tooltip={{ text: 'https://beta.openai.com/account/api-keys', targetNode: true, maxWidth: '500px' }}
				on:click|preventDefault={() => shell.openExternal('https://beta.openai.com/account/api-keys')}
			) OpenAI account
		.row
			button(on:click={close}) Cancel
			button(on:click={save}) Save

</template>


<style lang='scss'>

	:global * {
		transition: filter .175s ease;
	}

	:global body:has(dialog[open]) * {
		filter: brightness(.8);

		dialog, dialog * {
			filter: brightness(1);
		}
	}

	.row {
		display: flex;
		justify-content: space-between;
		margin-top: 25px;
	}

	.link {
		margin-top: 10px;
		color: hsla(0, 0%, 100%, .7);

		a {
			color: hsla(0, 0%, 100%, .85);
			cursor: pointer;

			&:hover {
				color: hsla(0, 0%, 100%, 1);
			}
		}
	}
	
	label {
		display: block;
		margin-bottom: 6px;
	}

	.blur-input {
		position: relative;
		overflow: hidden;
		width: 100vw;
		max-width: 600px;
		border-radius: 4px;

		&::before {
			opacity: 0;
			content: '';
			position: absolute;
			top: 2px;
			left: 2px;
			right: 2px;
			bottom: 2px;
			backdrop-filter: blur(8px);
			background-color: hsla(0, 0%, 100%, .02);
			pointer-events: none;
			z-index: 1;
			transition: .175s ease;
		}

		.text {
			opacity: 0;
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			z-index: 2;
			cursor: pointer;
			pointer-events: none;
			transition: .175s ease;
		}

		&.blur {
			&::before {
				opacity: 1;
			}
			.text {
				opacity: 1;
				pointer-events: all;
			}
		}
	}

	input {
		padding: 6px 12px;
		border-radius: 4px;
		background-color: c(primary);
		outline: none;
		color: white;
		font-size: 1rem;
		border: 1px solid var.Lightness(primary, 50%);
		width: 100%;
	}

	h3 {
		margin: 0;
		margin-bottom: 12px;
	}

	dialog {
		border-radius: 6px;
		border: none;
		box-shadow: 0 0 20px 0px hsla(0, 0%, 0%, .3);
		background-color: c(primary);
		color: white;

		&:focus {
			outline: none;
		}

		&, * {
			filter: brightness(1);
		}

		&::backdrop {
			opacity: 0;
		}
	}
	
</style>