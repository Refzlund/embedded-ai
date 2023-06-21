import { browser } from '$app/environment'
import type { ChatSessionMeta } from '$lib/types/session'
import { get, writable } from 'svelte/store'
import electron from '../electron'

const chatMeta = createMetaWritable()

function createMetaWritable() {
	const store = writable<ChatSessionMeta[]>()
	let last = -1

	async function loadMetaFile() {
		if (!browser)
			return
		let metaJSON = [] as ChatSessionMeta[]

		const { status, body } = await electron.requestAction({
			type: 'fsRead',
			body: {
				relativePath: './sessions-meta.json'
			}
		})

		if (status === 200)
			metaJSON = JSON.parse(body.result)
		else
			metaJSON = []

		store.set(metaJSON)
	}

	loadMetaFile()

	async function saveMetaFile() {
		const metaJSON = get(store)
		if (!metaJSON)
			throw new Error('Sessions meta not loaded')

		await electron.requestAction({
			type: 'fsWrite',
			body: {
				relativePath: './sessions-meta.json',
				data: JSON.stringify(metaJSON)
			}
		})
	}

	function getByMeta(meta: ChatSessionMeta) {
		const metaJSON = get(store)
		if (!metaJSON)
			throw new Error('Sessions meta not loaded')
		
		let index = last
		const current = metaJSON[index]

		if (current && current.id === meta.id) {
			metaJSON[index] = meta
			return meta
		}
		
		index = metaJSON.findIndex(v => v.id === meta.id)

		if (index === -1) {
			index = metaJSON.length
			last = index
			metaJSON.push(meta)
			store.update(v=>v)
			saveMetaFile()
		}
		
		return metaJSON[index]
	}

	return {
		...store,
		loadMetaFile,
		saveMetaFile,
		getByMeta
	}
}

export {
	chatMeta
}