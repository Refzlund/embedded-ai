import fs from 'fs/promises'
import { existsSync as exists } from 'fs'
import path from 'path'
import { app as application } from 'electron'
import app from '../app-store.cjs'
import type { IpcMainEvent } from 'electron'
import type { Respond } from './util/requestaction.cjs'

export async function fsRead(
	event: IpcMainEvent,
	{ relativePath }: {
		relativePath: string
	},
	respond: Respond
) {
	const start = app.settings.isdev ? process.cwd() : application.getPath('home')
	const absolutePath = path.resolve(start, app.settings.folder, relativePath)

	if (!exists(absolutePath))
		return respond(400, { error: 'File does not exist.' })

	const result = await fs.readFile(absolutePath, 'utf-8')
	return respond(200, { result })
}


export async function fsWrite(
	event: IpcMainEvent,
	{ relativePath, data }: {
		relativePath: string
		data: string
	},
	respond: Respond
) {
	const start = app.settings.isdev ? process.cwd() : application.getPath('home')
	const absolutePath = path.resolve(start, app.settings.folder, relativePath)
	const finalDirectoryPath = path.resolve(absolutePath, '..')

	// Does appPath exist?
	if (!exists(finalDirectoryPath))
		await fs.mkdir(finalDirectoryPath, { recursive: true })

	console.log('Writing to', absolutePath)
	await fs.writeFile(
		absolutePath,
		typeof data == 'string' ? data : JSON.stringify(data),
		{ encoding: 'utf-8' }
	)
	return respond(200)
}