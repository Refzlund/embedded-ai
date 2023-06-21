import { BrowserWindow, screen } from 'electron'
import ws from 'electron-window-state'
import app from './app-store.cjs'


export function createMainWindow() {
	if (app.state.mainwindow)
		return app.state.mainwindow

	const primaryScreen = screen.getPrimaryDisplay()

	const width = app.settings.isdev ? 1200 : 1000
	const height = primaryScreen.bounds.height

	const debug = false

	const mainwindow = new BrowserWindow({
		title: app.settings.name,
		icon: './icon.png',

		x: primaryScreen.bounds.width - width,
		y: 0,
		width,
		height,
		frame: false,
		fullscreen: false,
		movable: false,
		resizable: false,
		maximizable: false,
		fullscreenable: false,
		
		transparent: !debug,
		alwaysOnTop: !debug,
		skipTaskbar: !debug,

		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			devTools: true
		}
	})

	app.state.mainwindow = mainwindow

	mainwindow.once('close', () => {
		app.state.mainwindow = null
	})
	mainwindow.once('ready-to-show', () => {
		mainwindow?.show()
		mainwindow?.unmaximize()
		mainwindow?.setFullScreen(false)
		mainwindow?.webContents.executeJavaScript(`
			document.body.classList.add('visible')
			document.body.setAttribute('w', ${width})
			document.body.setAttribute('h', ${height})
		`)
	})

	if (!debug && !app.settings.isdev)
		mainwindow.removeMenu()
	else
		mainwindow.webContents.openDevTools()

	return mainwindow
}