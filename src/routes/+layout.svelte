<script lang='ts'>
	
	import electron from '$lib/stores/electron'
	import { onMount } from 'svelte'
	import { browser } from '$app/environment'
	import { addCopyCodeEventListener } from '$lib/components/Message/marked/marked-highlight/copycode'

	import.meta.glob('/src/lib/styles/global/**/*.scss', { eager: true })

	onMount(() => {
		addCopyCodeEventListener()
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (
					mutation.type === 'attributes' 
					&& mutation.attributeName === 'class'
				) {
					$electron.show = document.body.classList.contains('visible')
				}
			})
		})
		observer.observe(document.body, {
			attributes: true,
			attributeFilter: ['class']
		})

		return () => observer.disconnect()
	})
	
</script>





<template lang='pug'>
	
	svelte:head
		title Embedded AI

	#svelte
		slot

</template>




<style lang='scss'>

	#svelte {
		display: content;
		height: 100%;
	}
	
</style>