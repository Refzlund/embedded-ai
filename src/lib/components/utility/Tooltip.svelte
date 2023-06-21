<script lang='ts'>
	import type { TooltipStore } from '$lib/actions/tooltip'
	import type { Writable } from 'svelte/store'
	import { fly } from 'svelte/transition'
	import type { Placement } from 'svelte-floating-ui/dom'
	import electron from '$lib/stores/electron'
	
	export let tooltip: Writable<TooltipStore>

	function getFlyDirection(placement: Placement) {
		switch (placement) {
			case 'bottom': return { y: -10 }
			case 'bottom-end': return { y: -10 }
			case 'bottom-start': return { y: -10 }
			case 'left': return { x: -10 }
			case 'left-end': return { x: -10 }
			case 'left-start': return { x: -10 }
			case 'right': return { x: 10 }
			case 'right-end': return { x: 10 }
			case 'right-start': return { x: 10 }
			default: return { y: 10 }
		}
	}

</script>

<template lang='pug'>
	
	+if('$tooltip.visible && $electron.show')
		.tooltip(
			role='tooltip'
			--max-width='{$tooltip.options.maxWidth || "350px"}'
			transition:fly={{ duration: 100, ...getFlyDirection($tooltip.options.placement) }}
			use:$tooltip.floatingContent
		)
			.tooltip-content
				+html('$tooltip.options.text')

</template>




<style lang='scss'>
	
	
	.tooltip {
		position: absolute;
		padding: 5px 20px;
		pointer-events: none;
		background-color: transparent;
		z-index: 99999;
	}
	
	.tooltip-content {
		background-color: hsla(var.H(primary), var.S(primary, '+' 5%), 17%, 111);
		color: white;
		padding: 5px 10px;
		border-radius: 6px;
		max-width: v(max-width, 350px);
		width: max-content;
		white-space: pre-wrap;
	}
	
	
</style>