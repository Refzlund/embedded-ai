<script lang='ts'>
	
	import DropdownMenu, { 
		type DropdownMenuStore
	} from '$lib/components/utility/DropdownMenu'
	DropdownMenu

	import { tooltip } from '$lib/actions/tooltip'
	import { longPress } from '$lib/actions/longpress'
	import settings from '$lib/stores/app-settings'
	import type { OpenAI } from '$lib/types/openai-chat'
	import { onMount } from 'svelte'
	import Dialog from './Dialog.svelte'
	import { click } from '$lib/actions/click'
	import models from './models'
	
	
	export let dropdownmenu: DropdownMenuStore

	const debugButtons = false
	const hasModel = (model: OpenAI.Chat.Model) => ($settings?.possibleModels.findIndex(v => v === model) || -1) >= 0

	function setModel(model: OpenAI.Chat.Model) {
		if(!$settings) return
		console.log($settings)
		$settings.gptModel = model
		settings.saveSettings()
	}

	let openAPIDialog = false

</script>




<template lang='pug'>
	
	Dialog(bind:open={openAPIDialog})

	DropdownMenu({dropdownmenu})
		button.warn(
			use:tooltip={{ text: 'Set OpenAI API-key', placement: 'right' }}
			use:click={() => {
				openAPIDialog = true
				$dropdownmenu.visible = false
			}}
			tabindex='2'
		) Set API-Key

		+if('debugButtons || $settings?.apiKey')
			.enums
				+each('models as m')
					+if('debugButtons || hasModel(m.model)')
						button(
							use:tooltip={{ text: `Input: ` + m.input + `\\nOutput: ` + m.output, placement: 'right' }}
							class:active={$settings?.gptModel === m.model}
							use:click={() => setModel(m.model)}
						) {m.name}

		button(
			use:tooltip={{ text: 'Will close the application', placement: 'right' }}
			use:longPress={500}
			on:longpress={() => window.close()}
			--button__hover='hsla(0, 20%, 50%, 1)'
			--button='hsla(0, 20%, 50%, .8)'
			tabindex='0'
		)
			.fill #[span Exit]

</template>




<style lang='scss'>

	dialog {

	}
	
	.enums {
		display: flex;
		flex-direction: column;
		gap: 0;

		border: 1px solid c(dropdown-border);
		border-radius: 6px;
		

		> button {
			
			border: none;
			box-shadow: none;

			border-radius: 0;

			&:first-child {
				border-top-left-radius: 6px;
				border-top-right-radius: 6px;
			}

			&:last-child {
				border-bottom-left-radius: 6px;
				border-bottom-right-radius: 6px;
			}
			
			&:not(:last-child) {
				border-bottom: 1px solid var.Alpha(dropdown-border, '-' .2);
			}

			&:active {
				transform: scale(1);
			}

			&.active {
				$background: var.Lightness(dropdown-button, '-' .1);
				background-color: $background;

				cursor: default;
				box-shadow: inset 0 0 7px 0px var.Lightness(dropdown-border, 15%);
				&:focus, &:active {
					transform: scale(1);
					&::after {
						display: none;
					}
				}

				&:hover {
					background-color: $background;
				}
			}
		}
	}
	
</style>