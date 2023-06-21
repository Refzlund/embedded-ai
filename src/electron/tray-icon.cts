import { app as application, Tray, Menu } from 'electron'
import app from './app-store.cjs'
import { toggleApp } from './app-actions/index.cjs'
import getStaticFile from './get-static-file.cjs'

export function createTrayIcon() {
	const tray = new Tray(getStaticFile('icon.png'))
	const contextMenu = Menu.buildFromTemplate([
		{
			label: 'Toggle', 
			type: 'normal', 
			click: toggleApp
		},
		{
			label: 'Exit',
			type: 'normal',
			click: () => {
				application.exit()
			}
		}
	])
	tray.setToolTip('Embedded AI')
	tray.setContextMenu(contextMenu)
	tray.on('click', toggleApp)

	app.state.tray = tray
}