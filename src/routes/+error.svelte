<script lang='ts'>
	
	import { onMount } from 'svelte'
	
	import { page } from '$app/stores'
	
</script>




<template lang='pug'>
	
	error-container
		error
			h1 {$page.status} 
			h2 {$page.error.message}
			p {JSON.stringify($page.data)}
			

</template>




<style lang='scss'>
	
	error-container {
		display: block;
		height: 100%;
		width: 100%;
		padding: v(chat-padding);
	}

	error {
		display: block;
		background: white;
		height: 100%;
		width: 100%;
		padding: v(chat-padding);
	}
	
</style>