import type { IpcMainEvent } from 'electron'
import type { ModuleRecord, Respond } from './util/requestaction.cjs'


// -- Action modules

import { fsRead, fsWrite } from './fs.cjs'

const modules = {
	fsRead,
	fsWrite
}





export type Modules = ModuleRecord<typeof modules>
export default function evaluator(type: string, event: IpcMainEvent, body: any, respond: Respond) {
	const code = `modules['${type}'](event, body, respond)`
	
	try {
		return eval(code)
	} catch (error) {
		return respond(500, {
			code,
			error
		}) as any
	}
}
