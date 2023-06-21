import { get, type Writable } from 'svelte/store'
import { chatSession } from './stores/chat'
import type { OpenAI } from './types/openai-chat'
import appSettings from './stores/app-settings'
import { getModelMaxTokens, OpenAIPOST } from './utils/openai-api'
import appState from './stores/app-state'

const setProcessingAI = (processingAI: boolean) => appState.update($appState => {
	$appState.processingAI = processingAI
	return $appState
})

export async function processAI(model: OpenAI.Chat.Model, newMessage: ReturnType<typeof chatSession['newMessage']>) {	
	setProcessingAI(true)
	
	const $chatSession = get(chatSession)
	const $settings = get(appSettings)
	const $appState = get(appState)

	const maxModelTokens = getModelMaxTokens(model)
	const maxTokenOutput =
		$chatSession?.aiSettings?.aiOptions.max_tokens
		|| $settings?.global?.aiOptions?.max_tokens as number
		|| 768

	const { lastMessages, lastTokens, tokenCount } = chatSession.getLastMessages(maxModelTokens - maxTokenOutput)
	console.log({tokenCount})
	newMessage.onHumanDone(tokenCount || 0)

	const reader = await OpenAIPOST({
		model: model,
		...$settings?.global.aiOptions,
		...$chatSession.aiSettings.aiOptions,
		messages: lastMessages
	})

	let i = 0
	let onAIDone = () => { }
	let msg = {} as Writable<OpenAI.Chat.Message>

	while (true) {
		try {
			const { done, value } = await reader.read()
			if (done || !$appState.processingAI) {
				setProcessingAI(false)
				onAIDone()
				break
			}

			const datas: string[] =
				new TextDecoder().decode(value)
					.split('data: ')
					.map(data => data.trim())
					.filter(data => data.length > 0)

			let newContent = ''
			for (let data of datas) {
				if (data == '[DONE]')
					break

				const json = JSON.parse(data)
				newContent += json?.choices?.[0]?.delta?.content || ''
			}

			if (i == 0) {
				const newMessage = chatSession.newMessage(model, 'assistant', newContent)
				onAIDone = newMessage.onAIDone
				msg = newMessage.message
			}
			else {
				msg.update(msg => {
					msg.content ??= ''
					msg.content += newContent
					return msg
				})
			}

			i++
		} catch (error) {
			setProcessingAI(false)
			onAIDone()
			console.error(error)
			break
		}
	}
}