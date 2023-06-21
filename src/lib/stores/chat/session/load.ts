import electron from '$lib/stores/electron'
import { writable, type Writable } from 'svelte/store'
import { chatSession } from '.'
import type { OpenAI } from '$lib/types/openai-chat'
import type { MessageInfo } from '$lib/types/session'

export async function loadSession(id: string) {
	const { status, body } = await electron.requestAction({
		type: 'fsRead',
		body: {
			relativePath: `./sessions/${id}.json`
		}
	})
	if (status !== 200)
		return
	const json = JSON.parse(body.result)

	chatSession.set({
		...json,
		messages: writable<Writable<OpenAI.Chat.Message>[]>(json.messages.map((msg: OpenAI.Chat.Message) => writable(msg))),
		messageInfos: writable<MessageInfo[]>(json.messageInfos),
		messageSequence: writable<number[]>(json.messageSequence)
	})

	chatSession.newSession.update(v => v)
}