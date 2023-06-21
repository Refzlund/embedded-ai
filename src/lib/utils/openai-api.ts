import settings from '$lib/stores/app-settings'
import type { OpenAI } from '$lib/types/openai-chat'
import { get } from 'svelte/store'

export async function OpenAIPOST<const S extends boolean = true>(content: OpenAI.Chat.Chat, stream?: S):
	Promise<S extends true ? ReadableStreamDefaultReader : Record<any, any>>
{
	stream ??= true as S
	const { apiKey } = get(settings) || {}

	if (!apiKey)
		throw new Error('No API key provided')

	content.stream = stream
	try {
		const response = await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${apiKey}`
			},
			body: JSON.stringify(content)
		})

		if (!response.ok)
			throw new Error(`OpenAI returned ${response.status} ${response.statusText}`)

		if(stream)
			return response.body?.getReader() as ReadableStreamDefaultReader
		return response.json()
	} catch (error) {
		throw error
	}
	
}

export async function GetOpenAIModels() {
	const { apiKey } = get(settings) || {}

	if (!apiKey)
		throw new Error('No API key provided')
	
	try {
		const response = await fetch('https://api.openai.com/v1/models', {
			headers: {
				'Authorization': `Bearer ${apiKey}`
			}
		})
		if (!response.ok)
			throw new Error(`OpenAI returned ${response.status} ${response.statusText}`)
		
		const json = await response.json()

		let models: OpenAI.Chat.Model[] = []

		for (let model of json.data) {
			const id: OpenAI.Chat.Model = model.id
			if (id.startsWith('gpt-')) {
				models.push(id)
			}
		}

		return models.sort()
	} catch (error) {
		throw error
	}
}

export function getModelPrice(model: OpenAI.Chat.Model, isInput: boolean) {
	if (model == 'gpt-3.5-turbo-0613')
		return isInput ? 0.0015 : 0.002
	if (model == 'gpt-3.5-turbo-16k-0613')
		return isInput ? 0.003 : 0.004
	if (model == 'gpt-4-0613')
		return isInput ? 0.03 : 0.06
	if (model == 'gpt-4-32k-0613')
		return isInput ? 0.06 : 0.12
	return 0
} 

export function getModelMaxTokens(model: OpenAI.Chat.Model) {
	if (model == 'gpt-3.5-turbo-0613')
		return 4096 - 1
	if (model == 'gpt-3.5-turbo-16k-0613')
		return 16384 - 1
	if (model == 'gpt-4-0613')
		return 8192 - 1
	if (model == 'gpt-4-32k-0613')
		return 32768 - 1
	return 0
}