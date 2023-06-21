<script lang='ts'>
	
	import { slide, fly } from 'svelte/transition'
	import type { DropdownMenuStore } from './actions/dropdownmenu'
	import type { Writable } from 'svelte/store'
	import { leaveBoundary, clickOutside } from '$lib/actions'

	export let dropdownmenu: DropdownMenuStore
	export let debug = false

	$: width = $dropdownmenu.options.width || '250px'	

	if(debug)
		$dropdownmenu.visible = true
</script>




<template lang='pug'>
	
	+if('$dropdownmenu.visible')
		dropdown-menu(
			use:$dropdownmenu.floatingContent
			in:slide={{ duration: 175 }}
			out:slide={{ duration: 100 }}
			use:leaveBoundary={75}
			on:left={() => !debug && ($dropdownmenu.visible = false)}
			use:clickOutside={$dropdownmenu.ignoreClickOutside}
			on:clickoutside={() => !debug && ($dropdownmenu.visible = false)}
			--width='{width}'
		)
			slot
				button Example button
				button Love a shiba
				button Receive giraffe love

</template>




<style lang='scss'>
	
	dropdown-menu {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 10px;
		position: absolute;
		width: v(width, 250px);
		height: min-content;
		background: c(primary);
		border: 1px solid var.Lightness(primary, '+' 10%);
		border-radius: 6px;
		box-shadow: 0 0 10px 0 var.Lightness(primary, '-' 10%);
		top: 50%;
		left: 50%;
		z-index: 99999;

		@include var.colors(
			$dropdown-button: (button-default, button-default, button-default, .2),
			$dropdown-border: (button-default, button-default, button-default, .6)
		);

		:global {
			> button, * > button {
				min-height: 45px;
				height: 45px;

				&:not(:hover):not(.warn):not(.active) {
					background-color: v(button, c(dropdown-button));
				}
				border: 1px solid c(dropdown-border);
				--color-button-default-hover: #{var.Alpha(button-default, .6)};
				box-shadow: none;
			}
		}
	}
	
</style>