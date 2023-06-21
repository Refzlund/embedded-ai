export function leaveBoundary(node: HTMLElement, distance: number = 100) {
	function handleMouseMove(event: MouseEvent) {
		const { clientX, clientY } = event
		const {
			top,
			left,
			bottom,
			right
		} = node.getBoundingClientRect()

		const isOutside =
			clientX < left - distance ||
			clientX > right + distance ||
			clientY < top - distance ||
			clientY > bottom + distance

		if (isOutside)
			dispatch()
	}

	const dispatch = () => node.dispatchEvent(new CustomEvent('left'))

	window.addEventListener('mousemove', handleMouseMove)
	window.document.body.addEventListener('mouseleave', dispatch)

	return {
		destroy() {
			window.removeEventListener("mousemove", handleMouseMove)
			window.document.body.removeEventListener("mouseleave", dispatch)
		}
	}
}