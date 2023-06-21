import { writable } from 'svelte/store'

const appState = writable({
	input: '',
	processingAI: false,
	newSession: false
})

export default appState