import { get } from 'svelte/store'
import { chatSession } from '.'
import type { OpenAI } from '$lib/types/openai-chat'
import type { MessageInfo } from '$lib/types/session'
import appSettings from '$lib/stores/app-settings'

export function getLastMessages(maxTokens: number) {
	const $session = get(chatSession)
	const $messages = get($session.messages)
	const $messageInfos = get($session.messageInfos)
	const { global: { prependedMessages } } = get(appSettings)
	
	if ($session.lastMessageIndex === null)
		return { lastMessages: [], lastTokens: [] }
	let lastMessages: OpenAI.Chat.Message[] = []
	let lastTokens: number[] = []

	let tokenCount = prependedMessages.reduce((prev, curr) => prev += curr.tokens, 0)
	let index: number | null = $session.lastMessageIndex

	// TODO: Cut off messages so that the total token count is less than maxTokens when going over
	while (tokenCount < maxTokens && index !== null && index >= 0) {
		const info = $messageInfos[index] as MessageInfo
		tokenCount += info.tokens
		if (tokenCount > maxTokens) {
			tokenCount -= info.tokens
			break
		}
		const msg = get($messages[index])
		lastMessages.unshift(msg)
		lastTokens.unshift(info.tokens)
		index = info.prevMessageIndex
	}

	lastMessages = [
		...prependedMessages.map(v => ({ content: v.content, role: v.role, function_call: v.function_call, name: v.name })),
		...lastMessages
	]

	lastTokens = [
		...prependedMessages.map(v => v.tokens),
		...lastTokens
	]

	return { lastMessages, lastTokens, tokenCount }
}