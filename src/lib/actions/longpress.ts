/** 
 * Sets --t variable 0-1
 * @example 
	button(
		use:longPress={500}
		on:longpress={() => ...}
	)
		.fill #[span Clear]
*/
export function longPress(node: HTMLElement, msDuration: number) {
	let timeoutId: NodeJS.Timeout | null
	let start: number

	function startPress(event) {
		start = Date.now()
		timeoutId = setTimeout(() => {
			node.dispatchEvent(new CustomEvent("longpress"))
			stopPress(event)
		}, msDuration)
		handleStep()
	}

	function handleStep() {
		if (!timeoutId)
			return
		const t = (Date.now() - start) / msDuration
		node.dispatchEvent(
			new CustomEvent("t", {
				detail: t
			})
		)
		node.style.setProperty("--t", t.toString())
		requestAnimationFrame(handleStep)
	}

	function stopPress(event) {
		clearTimeout(timeoutId as NodeJS.Timeout)
		timeoutId = null
		node.style.setProperty("--t", '0')

		if (!('key' in event))
			node.blur()
	}

	function keydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ')
			startPress(event)
	}

	function keyup(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ')
			stopPress(event)
	}

	node.addEventListener("mousedown", startPress)
	node.addEventListener("mouseup", stopPress)
	node.addEventListener("mouseleave", stopPress)
	node.addEventListener('keypress', keydown)
	node.addEventListener('keyup', keyup)

	return {
		destroy() {
			node.removeEventListener("mousedown", startPress)
			node.removeEventListener("mouseup", stopPress)
			node.removeEventListener("mouseleave", stopPress)
			node.removeEventListener('keypress', keydown)
			node.removeEventListener('keyup', keyup)
		}
	}
}
