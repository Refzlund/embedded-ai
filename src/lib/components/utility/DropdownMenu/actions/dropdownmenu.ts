import { offset, flip, shift, type Placement } from 'svelte-floating-ui/dom'
import { createFloatingActions, type ContentAction } from 'svelte-floating-ui'
import { get, writable, type Writable } from 'svelte/store'
import { click } from '$lib/actions/click'

export type DropdownMenuStore = Writable<{
	visible: boolean
	options: Options
	floatingContent: ContentAction
	ignoreClickOutside: HTMLElement[]
}>

interface Options {
	/** Should contain `DropdownMenu(export:dropdownmenu)` */
	component: any
	props: any

	width?: number

	placement: Placement
	offset?: [number, number]
	/** Alternative option to handle DropdownMenu visibility through a store */
	visible?: Writable<boolean>
	/** @default false */
	attachToNode: boolean

}

export function dropdownmenu(node: HTMLElement, options: Options) {

	const [floatingRef, floatingContent] = createFloatingActions({
		strategy: 'absolute',
		placement: options.placement,
		middleware: [
			offset({
				mainAxis: options.offset?.[0] || 0,
				crossAxis: options.offset?.[1] || 0,
			}),
			flip(),
			shift(),
		]
	})

	floatingRef(node)

	const store: DropdownMenuStore = writable({
		visible: false,
		floatingContent,
		options,
		ignoreClickOutside: [node]
	})

	const component = new options.component({
		target: options.attachToNode ? node : document.body,
		props: {
			dropdownmenu: store,
			...options.props
		}
	})

	function show() {
		store.update(state => {
			state.visible = true
			return state
		})
	}

	function hide() {
		store.update(state => {
			state.visible = false
			return state
		})
	}

	function toggle() {
		store.update(state => {
			state.visible = !state.visible
			return state
		})
	}

	options.visible?.subscribe(value => {
		if (value)
			show()
		else
			hide()
	})

	let clickAction: ReturnType<typeof click> | undefined
	if (!options.visible) {
		clickAction = click(node, toggle)
	}

	return {
		destroy() {
			component.$destroy()
			if (clickAction)
				clickAction.destroy()
		},
		update(options: Options) {
			store.update(state => {
				state.options = options
				return state
			})
			component.props = options.props
		}
	}
}