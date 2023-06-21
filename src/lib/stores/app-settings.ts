import { writable, get } from 'svelte/store'
import electron from './electron'
import { GetOpenAIModels } from '$lib/utils/openai-api'
import type { AppSettings } from '$lib/types/app'
import defaultSystem from '$lib/utility/templates/default.system'
import defaultInstructions from '$lib/utility/templates/default.instructions'
import defaultAiOptions from '$lib/utility/templates/default.aioptions'
import { browser } from '$app/environment'

export function applyUnsetSettings(settings = {} as AppSettings) {
	settings.possibleModels ??= []
	settings.global ??= {} as AppSettings['global']
	settings.global.prependedMessages ??= defaultInstructions
	settings.gptModel ??= 'gpt-3.5-turbo-0613'
	settings.titleGptModel ??= 'gpt-3.5-turbo-0613'

	settings.global.aiOptions ??= {}
	settings.global.aiOptions = { ...defaultAiOptions, ...settings.global.aiOptions }

	return settings
}

const settings = writable<AppSettings>()

function getModels() {
	const $settings = get(settings)
	if ($settings.apiKey)
		GetOpenAIModels().then(v => settings.update($settings => {
			$settings.possibleModels = v
			return $settings
		}))
}

async function loadSettings() {
	if (!browser)
		return
	let settingsJSON = {} as AppSettings

	const { status, body } = await electron.requestAction({
		type: 'fsRead',
		body: {
			relativePath: './settings.json'
		}
	})

	if (status === 200)
		settingsJSON = JSON.parse(body.result)

	applyUnsetSettings(settingsJSON)
	settings.set(settingsJSON)

	getModels()
	saveSettings()
}

loadSettings()

function saveSettings() {
	const settingsJSON = get(settings)
	if (!settingsJSON)
		throw new Error('Settings not loaded')
	
	electron.requestAction({
		type: 'fsWrite',
		body: {
			relativePath: './settings.json',
			data: JSON.stringify(settingsJSON)
		}
	})
}

export default {
	...settings,
	saveSettings,
	getModels
}