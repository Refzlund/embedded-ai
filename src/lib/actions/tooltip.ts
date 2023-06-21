import { offset, flip, shift, type Placement } from 'svelte-floating-ui/dom'
import { createFloatingActions, type ContentAction } from 'svelte-floating-ui'
import { type Writable, writable, get } from 'svelte/store'
import Tooltip from '$lib/components/utility/Tooltip.svelte'
import { tick } from 'svelte'
import type { CustomMouseEvent } from './click'

export interface TooltipStore {
	visible: boolean
	options: Options
	floatingContent: ContentAction
}

interface Options {
	text: string
	placement?: Placement
	targetNode?: boolean
	maxWidth?: string
	/** @default 0 */
	delay?: number
	/** @default true */
	hideOnClick?: boolean
	/** @default false */
	showOnClick?: boolean
}

export function tooltip(node: HTMLElement, options: Options) {

	const [floatingRef, floatingContent] = createFloatingActions({
		strategy: 'absolute',
		placement: options.placement || 'top',
		middleware: [
			offset(6),
			flip(),
			shift(),
		]
	})	

	floatingRef(node)

	const store: Writable<TooltipStore> = writable({
		visible: false,
		floatingContent,
		options
	})

	let timer: NodeJS.Timer | undefined

	
	function setVisibility(visible: boolean) {
		store.update(state => {
			state.visible = visible
			return state
		})
	}
	const turnVisible = () => setVisibility(true)
	const turnInvisible = () => setVisibility(false)

	let shouldShow = false
	function show() {
		shouldShow = true
		if (timer || get(store).visible)
			return
		timer = setTimeout(() => {
			clearTimeout(timer)
			timer = undefined
			if (get(store).visible || !shouldShow)
				return
			store.update(state => {
				state.visible = true
				return state
			})
		}, get(store).options.delay || 0);
	}

	function hide() {
		shouldShow = false
		if(node.contains(document.activeElement)) return
		store.update(state => {
			state.visible = false
			return state
		})
	}
	
	function mouseDown(e: MouseEvent) {
		if (!get(store).visible)
			e.preventDefault()
	}

	function keyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ')
			turnInvisible()
	}

	let hasLabel = node.getAttribute('aria-label')

	if(!hasLabel)
		node.setAttribute('aria-label', options.text)
	
	node.addEventListener('mouseenter', show)
	node.addEventListener('mouseleave', hide)
	node.addEventListener('mousedown', mouseDown)
	node.addEventListener('keydown', keyDown)
	node.addEventListener('focusin', show)
	node.addEventListener('focusout', hide)
	if(options.hideOnClick || true)
		node.addEventListener('click', hide)
	if (options.showOnClick)
		node.addEventListener('click', turnVisible)

	const tooltip = new Tooltip({
		target: options.targetNode ? node : document.body,
		props: {
			tooltip: store
		}
	})

	return {
		destroy() {
			node.removeEventListener('mouseenter', show)
			node.removeEventListener('mouseleave', hide)
			node.removeEventListener('mousedown', mouseDown)
			node.removeEventListener('keydown', keyDown)
			node.removeEventListener('focusin', show)
			node.removeEventListener('focusout', hide)
			if (options.hideOnClick || true)
				node.removeEventListener('click', hide)
			if (options.showOnClick)
				node.removeEventListener('click', turnVisible)

			tooltip.$destroy()
		},
		update(options: Options) {
			if (!hasLabel)
				node.setAttribute('aria-label', options.text)
			store.update(state => {
				state.options = options
				return state
			})
		}
	}
}
