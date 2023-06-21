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
	import { click } from '$lib/actions/click'
	import { chatMeta, chatSession } from '$lib/stores/chat'
	import { formatRelativeTime } from '$lib/utility/relative-time'
	import appState from '$lib/stores/app-state'
	
	export let dropdownmenu: DropdownMenuStore
	
	// const t = $chatMeta[0]
</script>




<template lang='pug'>
	
	DropdownMenu({dropdownmenu})
		+if('$chatMeta')
			.sessions
				+each('$chatMeta as meta, i')
					+const('lastActive = formatRelativeTime(meta.modifiedAt)')
					button.session(
						autofocus={!$appState.newSession && $chatSession.meta.id === meta.id}
						use:tooltip={{ text: 'Created ' + formatRelativeTime(meta.createdAt), placement: 'right' }}
						use:click={() => chatSession.loadSession(meta.id)}
						class:active={$chatSession.meta.id === meta.id}
						tabindex='{$chatMeta.length - i}'
						aria-label='Title: {meta.title}. Last active: {lastActive}'
					)
						h5 {meta.title}
						span.activity Last active {lastActive}
		button(
			use:click={() => chatSession.createNewSession()}
			tabindex='0'
		).warn New Session

</template>




<style lang='scss'>

	.sessions {
		display: flex;
		flex-direction: column;
		gap: 10px;
		max-height: 600px;
		overflow: hidden;
		overflow-y: auto;
		padding: 5px;
	}

	.warn {
		background-color: var.Alpha(warn, .05) !important;
		border: 1px solid var.Alpha(warn, .5) !important;
		&:hover {
			background-color: var.Alpha(warn-hover, .15) !important;
		}
	}

	button.session {
		min-height: 65px;
		height: max-content;
		display: flex;
		flex-direction: column;
		gap: 0px;
		text-align: start;
		align-items: start;
		&:not(:hover) {
			background-color: transparent !important;
		}
	}

	button.active, button.active:not(:hover) {
		background-color: var.Alpha(good, .05) !important;
		border: 1px solid var.Alpha(good, .5) !important;
		cursor: default;
	}

	h5 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		line-clamp: 2;
		word-break: 'none';
		overflow: hidden;

		margin: 0;
		max-width: 100%;
		//- hyphens: auto;
		
		//- text-overflow: ellipsis;
		//- white-space: nowrap;
	}

	.activity {
		font-size: 0.9rem;
		opacity: .5;
	}
		

	
</style>