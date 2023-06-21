import type { OpenAI } from '$lib/types/openai-chat'
import type { ChatSession, MessageInfo } from '$lib/types/session'
import { get, writable, type Writable } from 'svelte/store'

import { saveSession } from './save'
import { loadSession } from './load'
import { newMessage } from './new-message'
import { getLastMessages } from './get-last-messages'
import { reloadMessageSequence } from './reload-message-sequence'
import appState from '$lib/stores/app-state'

function createChatSessionWritable() {

	const session = writable<ChatSession>()
	let newSession = writable()

	function createNewSession() {
		const now = Date.now()
		session.set({
			meta: {
				id: now + '-' + Math.random().toString(36).substring(7),
				createdAt: Date.now(),
				modifiedAt: Date.now(),
				title: 'Untitled Session'
			},
			responses: 0,
			sumResponseTokens: 0,
			averageResponseTokens: 0,
			totalEstCost: 0,
			lastMessageIndex: null,
			nextMessageIndex: null,
			branches: [],
			aiSettings: {
				aiOptions: {}
			},
			messages: writable([]),
			messageInfos: writable([]),
			messageSequence: writable([])
		} as ChatSession)
		appState.update(v => {
			v.newSession = true
			return v
		})
	}

	createNewSession()

	function getMessage(index: number) {
		return get(get(session).messages)[index]
	}
	
	const w = {
		...session,
		createNewSession,
		newMessage,
		saveSession,
		loadSession,
		getLastMessages,
		getMessage,
		reloadMessageSequence
	}

	newSession.set(w)
	return {...w, newSession} as typeof w & { newSession: Writable<typeof w> }
}

export const chatSession = createChatSessionWritable()