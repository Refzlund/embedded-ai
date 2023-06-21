<script lang='ts'>
	import { tooltip } from '$lib/actions/tooltip'
	import { Icon, icons } from '$lib/icons'
	// import chat, { messages } from '$lib/stores/chat'
	import { fly } from 'svelte/transition'
	import DropdownMenu, { dropdownmenu } from '../utility/DropdownMenu'
	import { longPress } from '$lib/actions/longpress'
	import AppSettings from './AppSettings.svelte'
	import settings from '$lib/stores/app-settings'
	import { click } from '$lib/actions/click'
	import appState from '$lib/stores/app-state'
	import ChatHistory from './ChatHistory.svelte'
	import appSettings from '$lib/stores/app-settings'
	import models from './models'
	import { chatSession } from '$lib/stores/chat'
	
	export let elements: Record<any, HTMLElement> = {} 
	
</script>



<template lang='pug'>

	.stripe-menu(
		in:fly={{y: 250, duration: 650}}
		out:fly={{y: 250, duration: 125}}
	)
		button.icon.settings(
			bind:this={elements.settings}
			use:dropdownmenu={{ 
				component: ChatHistory, 
				placement: 'top-start', 
				offset: [6, -6],
				width: '500px'
			}}
			use:tooltip={{ text: 'Chat History' }}
		) #[Icon(icon={icons.history})]
		button.icon.settings(
			bind:this={elements.settings}
			use:dropdownmenu={{ 
				component: AppSettings, 
				placement: 'top-start', 
				offset: [6, -6]
			}}
			class:model={$appSettings.gptModel}
			use:tooltip={{ text: 'App Settings' }}
		) #[Icon(icon={icons.settings})]
		+if('$appSettings.gptModel')
			span.gptmodel {models.find(v => v.model === $appSettings.gptModel).name}
		div(style:width='100%')
		span.estprice(
			use:tooltip={{ text: 'Estimated cost' }}
		) ${$chatSession.totalEstCost.toFixed(4)}
		button.split-button(
			class:active={$appState.processingAI}
			use:tooltip={{ text: $appState.processingAI ? 'Stop current transmission' : 'Send to AI' }}
			--w='125px'
			bind:this={elements.process}
			disabled={!$settings?.apiKey || !$settings?.gptModel}
		)
			.buttons
				button.send.icon(
					--button__hover='hsla(145, 70%, 40%, 1)'
					--button='hsl(145, 70%, 35%)'
					tab-index='-1'
				) #[Icon(icon={icons.send})] Send
				button.send.icon(
					--button__hover='hsla(0, 60%, 40%, 1)'
					--button='hsl(0, 60%, 35%)'
					tab-index='-1'
				) Stop

</template>




<style lang='scss'>
	
	.gptmodel, .estprice {
		min-width: max-content;
		background-color: var.Alpha(primary, .6);
		border: 1px solid var.Alpha(primary, 1);
		height: 50px;
		margin-left: -15px;
		padding: 10px 20px;
		color: hsla(0, 0%, 100%, .7);
		border-radius: 0px 5px 5px 0px;
		pointer-events: none;
		user-select: none;
	}

	.estprice {
		color: c(warn-hover);
		cursor: default;
		pointer-events: all;
		user-select: text;
		border-radius: 5px;
	}

	.model {
		border-top-right-radius: 0px; 
		border-bottom-right-radius: 0px; 
	}

	.split-button {
		position: relative;
		height: 50px;
		min-width: v(w, 100px);
		max-width: v(w, 100px);
		//- overflow: hidden;
		padding: 0;

		> .buttons {
			position: absolute;
			width: 100%;
			height: 100%;
			overflow: hidden;
			border-radius: 5px;
			left: 0;
			top: 0;
			> * {
				position: absolute;
				width: 100%;
				height: 100%;
				transition: transform .3s ease;
				border-radius: 0;
				left: 0;

				&:focus::after {
					display: none !important;
				}
			}
			> *:nth-child(1), > *:nth-child(2) {
				transform: translateY(0%);
			}
			> *:nth-child(2) {
				top: 100%;
			}
		}

		&.active > .buttons > *:nth-child(1), &.active > .buttons > *:nth-child(2) {
			transform: translateY(-100%);
			display: initial;
		}		
	}

	.stripe-menu {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		gap: 12px;
		width: 100%;
	}

	.clear {
		min-width: 90px;
		border: 1px solid hsl(50, 20%, 60%);
	}

	.send {
		// Nice green color
		min-width: 110px;
	}
	
</style>