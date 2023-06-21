import app from '../app-store.cjs'

export function hideApp() {
	app.state.visible = false
	app.state.mainwindow?.setIgnoreMouseEvents(true, { forward: true })
	app.state.mainwindow?.blur()
	app.state.mainwindow?.webContents.executeJavaScript(`
		document.body.classList.add('hidden')
		document.body.classList.remove('visible')
	`)
}

export function showApp() {
	app.state.visible = true
	app.state.mainwindow?.setIgnoreMouseEvents(false)
	app.state.mainwindow?.focus()
	app.state.mainwindow?.webContents.executeJavaScript(`
		document.body.classList.add('visible')
		document.body.classList.remove('hidden')
	`)
}

export function toggleApp() {
	if (app.state.visible)
		hideApp()
	else
		showApp()
}