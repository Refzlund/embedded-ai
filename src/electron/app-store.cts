import {
	app as application,
	type BrowserWindow,
	type Tray
} from 'electron'

const settings = {
	isdev: !application.isPackaged || (process.env.NODE_ENV === 'development'),
	port: process.env.PORT || 3000,
	name: 'Embedded AI',
	folder: '.embedded-ai'
}

const state = {
	visible: false,
	mainwindow: null as BrowserWindow | null,
	tray: null as Tray | null
}

const app = {
	state, settings
}

export default app