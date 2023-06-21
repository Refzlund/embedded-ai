import type { IpcMainEvent } from 'electron'
import type { Modules } from '../index.cjs'
import evaluator from '../index.cjs'

type Module = (event: IpcMainEvent, content: any, respond: Respond) => any

export type ModuleRecord<M extends Record<string, Module>> = M

export type ActionResponse<K extends keyof Modules> = ReturnType<Modules[K]>

export type ActionContent<K extends keyof Modules> = Parameters<Modules[K]>[1]

export type ActionRequest<K extends keyof Modules, B extends ActionContent<K>> = {
	id: string,
	type: K,
	body: B
}

export type Respond =
	<const S extends 200 | 400 | 500, const B>(status: S, body?: B) => {
		id: string
		status: S
		body: B
	}

export type RequestAction = typeof requestaction

function createRespond(event: IpcMainEvent, id: string) {
	const respond = <S extends 200 | 400 | 500, B>(status: S, body: B) =>
		event.sender.send('mainprocess-response', { id, status, body })
	return respond as unknown as Respond
}

export default function requestaction<const K extends keyof Modules, const B extends ActionContent<K>>(
	event: IpcMainEvent,
	request: ActionRequest<K, B>
): ActionResponse<K> {
	// console.log('request', request)
	const { id, body, type } = request

	const respond = createRespond(event, id)
	return evaluator(type, event, body, respond)
}