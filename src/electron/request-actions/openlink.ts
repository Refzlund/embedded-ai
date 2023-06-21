import { shell } from 'electron'
import type { IpcMainEvent } from 'electron'
import type { Respond } from './util/requestaction.cjs'

export default async function openLink(
	event: IpcMainEvent,
	{ path }: {
		path: string
	},
	respond: Respond
) {
	shell.openExternal(path)
	return respond(200, null)
}
