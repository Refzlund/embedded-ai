import { browser } from '$app/environment'
import { writable } from 'svelte/store'
import type { ActionRequest, ActionContent, ActionResponse } from '../../electron/request-actions/util/requestaction.cjs'
import type { Modules } from '../../electron/request-actions/index.cjs'

let electron = writable(!browser ? {} : {
	show: true,
	width: parseInt(document.body.getAttribute('w') as string),
	height: parseInt(document.body.getAttribute('h') as string)
})

const requestAction = async <K extends keyof Modules, B extends ActionContent<K>>(content: Omit<ActionRequest<K, B>, 'id'>) => {
	const { ipcRenderer } = require('electron')

	if (!browser)
		return null as unknown as Promise<ActionResponse<K>>

	const randomId = Math.random().toString(36).substring(7)

	ipcRenderer.send('request-mainprocess-action', { id: randomId, ...content })
	
	return new Promise(res => {
		function listener(event: any, response: any) {
			if (response.id !== randomId)
				return
			delete response['id']
			res(response)
			ipcRenderer.off('mainprocess-response', listener)
		}
		ipcRenderer.on('mainprocess-response', listener)
	}) as unknown as ActionResponse<K>
}

export default {...electron, requestAction}