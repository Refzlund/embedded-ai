export type CustomMouseEvent = (MouseEvent & { keyboardEvent: KeyboardEvent, touchEvent: TouchEvent })
export type CustomClickEvent = (Event & { keyboardEvent: KeyboardEvent, touchEvent: TouchEvent, mouseEvent: MouseEvent })

type ClickHandler = (event: CustomMouseEvent) => void

interface ClickOptions {
	leftClick?: ClickHandler
	rightClick?: ClickHandler
	middleClick?: ClickHandler
}

export function click(node: HTMLElement, options: ClickOptions | ClickHandler) {
	// Assign handlers based on the provided options
	let leftClick: ClickHandler = () => { }
	let rightClick: ClickHandler = () => { }
	let middleClick: ClickHandler = () => { }

	if (typeof options === 'object') {
		leftClick = options.leftClick ?? leftClick
		rightClick = options.rightClick ?? rightClick
		middleClick = options.middleClick ?? middleClick
	} else {
		leftClick = options
	}

	const mouseupHandler = (event: CustomMouseEvent) => {
		if ('button' in event) {
			switch (event.button) {
				case 0: // Left button
					leftClick(event)
					break
				case 1: // Middle button
					middleClick(event)
					break
				case 2: // Right button
					rightClick(event)
					break
				default:
					break
			}
		}
		
		if ('touchEvent' in event) {
			const ev = event.touchEvent
			switch (ev.touches.length) {
				case 1:
					leftClick(event)
					break
				case 2:
					rightClick(event)
					break
				case 3:
					middleClick(event)
					break
				default:
					break
			}
		}
		
		const clickEvent = new CustomEvent('click') as unknown as CustomClickEvent 
		clickEvent.touchEvent = event.touchEvent
		clickEvent.keyboardEvent = event.keyboardEvent
		clickEvent.mouseEvent = event

		node.dispatchEvent(clickEvent)
		if (!('keyboardEvent' in event))
			node.blur()
		
		node.removeAttribute('active')
		event.preventDefault()
	}

	const mousedownHandler = () => {
		node.setAttribute('active', 'true')
	}

	const createKeyHandler = (eventType: string) => (event: KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ') {
			const clickEvent = new MouseEvent(eventType, { button: 0 }) as CustomMouseEvent
			clickEvent.keyboardEvent = event

			node.dispatchEvent(clickEvent)
			event.preventDefault()
		}
	}

	const touchHandler = (mouseEvent: string) => (touchEvent: TouchEvent) => {
		const clickEvent = new MouseEvent(mouseEvent) as CustomMouseEvent

		node.dispatchEvent(clickEvent)
		touchEvent.preventDefault()
	}

	const keydownHandler = createKeyHandler('mousedown')
	const keyupHandler = createKeyHandler('mouseup')
	const touchstartHandler = touchHandler('mousedown')
	const touchendHandler = touchHandler('mouseup')
	
	// Add event listeners
	node.addEventListener('mouseup', mouseupHandler as (event: MouseEvent) => void)
	node.addEventListener('mousedown', mousedownHandler)
	node.addEventListener('keydown', keydownHandler)
	node.addEventListener('keyup', keyupHandler)
	node.addEventListener('touchstart', touchstartHandler)
	node.addEventListener('touchend', touchendHandler)

	// Return destroyer function
	return {
		destroy() {
			node.removeEventListener('mouseup', mouseupHandler as (event: MouseEvent) => void)
			node.removeEventListener('mousedown', mousedownHandler)
			node.removeEventListener('keydown', keydownHandler)
			node.removeEventListener('keyup', keyupHandler)
			node.removeEventListener('touchstart', touchstartHandler)
			node.removeEventListener('touchend', touchendHandler)
		}
	}
}