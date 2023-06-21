import path from 'path'
import app from './app-store.cjs'
import { app as application } from 'electron'

/**
 * When the application built, the app folder will contain the static folder.
 * To access files (such as icon images etc.) they're to be placed in that folder.
*/
export default function getStaticFile(relativePath: string) {
	if (app.settings.isdev)
		return path.resolve(process.cwd(), 'static', relativePath)

	return path.resolve(application.getAppPath(), './icon.png')
}