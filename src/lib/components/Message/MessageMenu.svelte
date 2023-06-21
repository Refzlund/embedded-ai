<script lang='ts'>

	import type { Writable } from 'svelte/store'
	import { click } from '$lib/actions'

	import DropdownMenu, { 
		type DropdownMenuStore
	} from '$lib/components/utility/DropdownMenu'
	
	DropdownMenu
	
	
	
	export let dropdownmenu: DropdownMenuStore

	export let 
		showOriginal: Writable<boolean>,
		editing: Writable<boolean>,
		onEditSave: () => void
	
	function changeFormat() {
		$showOriginal = !$showOriginal
	}

</script>




<template lang='pug'>
	
	DropdownMenu({dropdownmenu})
		+if('!$editing')
			button(use:click={changeFormat}) {$showOriginal ? 'Show formatted' : 'Show original'}
		+if('!$editing')
			button(use:click={() => $editing = true}).warn Edit
		+if('$editing')
			button(use:click={onEditSave}) Save changes
			button(use:click={() => $editing = false}) Cancel editing
		

</template>




<style lang='scss'>
	
	
	
</style>