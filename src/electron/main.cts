import {
	app as application,
	ipcMain,
	globalShortcut
} from 'electron'
import serve from 'electron-serve'
import app from './app-store.cjs'
import requestaction from './request-actions/util/requestaction.cjs'
import { toggleApp, showApp, loadVite } from './app-actions/index.cjs'
import { createMainWindow } from './main-window.cjs'
import { createTrayIcon } from './tray-icon.cjs'

try { require('electron-reloader')(module) } catch {}

const loadURL = serve({ directory: '.' })

ipcMain.on('close', () => {
	app.state.mainwindow?.close()
})

ipcMain.on('request-mainprocess-action', requestaction)

application.once('ready', async () => {
	const mainwindow = createMainWindow()
	createTrayIcon()

	if (app.settings.isdev)
		loadVite(Number(app.settings.port))
	else
		await loadURL(mainwindow)

	globalShortcut.register('Alt+X', toggleApp)
	showApp()

	mainwindow?.on('closed', () => {
		application.exit()
	})
})

application.on('activate', createMainWindow)

application.on('window-all-closed', () => {
	if (process.platform !== 'darwin')
		application.quit()
})
