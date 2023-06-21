import app from '../app-store.cjs'

export function loadVite(port: number) {
	app.state.mainwindow?.loadURL(`http://localhost:${port}`).catch(() => {
		setTimeout(() => { loadVite(port) }, 200)
	})
}