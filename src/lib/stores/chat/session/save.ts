import { get } from 'svelte/store'
import { chatSession } from '.'
import { chatMeta } from '$lib/stores/chat/meta'
import electron from '$lib/stores/electron'
import appSettings from '$lib/stores/app-settings'
import { OpenAIPOST, getModelPrice } from '$lib/utils/openai-api'
import appState from '$lib/stores/app-state'

export async function saveSession() {
	const $session = get(chatSession)
	const $messages = get($session.messages)

	const meta = chatMeta.getByMeta($session.meta)
	meta.modifiedAt = Date.now()

	const data = JSON.stringify($session, (key, value) => {
		if (value && typeof value == 'object' && 'subscribe' in value)
			return get(value)
		return value
	})
	electron.requestAction({
		type: 'fsWrite',
		body: {
			relativePath: `./sessions/${$session.meta.id}.json`,
			data
		}
	})

	appState.update(v => {
		v.newSession = false
		return v
	})

	if ($messages.length === 2) {
		const $settings = get(appSettings)
		const model = $settings.titleGptModel
		if (model) {
			const json = await OpenAIPOST({
				model,
				messages: [
					get($messages[0]),
					get($messages[1]),
					{
						role: 'user',
						content: `----

Turn the prompt above into concise and formally descriptive title using max 7 words:`
					}
				]
			}, false)

			const title: string | null = json.choices?.[0]?.message?.content
			if (title) {
				if (title.startsWith('"') && title.endsWith('"'))
					meta.title = title.slice(1, -1)
				else
					meta.title = title
				$session.meta.title = meta.title
			}
			const promptTokens: number | null = json.usage?.['prompt_tokens']
			const completionTokens: number | null = json.usage?.['completion_tokens']
			$session.totalEstCost +=
				getModelPrice(model, true) * ((promptTokens || 0) / 1000)
				+ getModelPrice(model, false) * ((completionTokens || 0) / 1000)

			chatSession.update(v => v)
		}
	}
	chatMeta.update(v => v)
	chatMeta.saveMetaFile()
}