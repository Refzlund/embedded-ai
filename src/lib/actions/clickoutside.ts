import { tick } from 'svelte'

export function clickOutside(node: HTMLElement, ignore: HTMLElement[]) {
	
	let clickInside = false
	function handleClick(event: MouseEvent & { target: any }) {
		if (event.defaultPrevented)
			return
		
		try {
			const inNode = node.contains(event.target)
			const inIgnore = ignore.some((i) => i.contains(event.target))

			if (!inNode && !inIgnore)
				node.dispatchEvent(new CustomEvent('clickoutside'))
			else {
				clickInside = true
				tick().then(() => clickInside = false)
			}
		} catch (error) {
			console.error(error)
		}
		
	}

	async function focusOut(event: FocusEvent) {
		if (clickInside)
			return
		requestAnimationFrame(() => {
			if (node.contains(document.activeElement))
				return
			node.dispatchEvent(new CustomEvent('clickoutside'))
		})
		
	}

	document.addEventListener('click', handleClick, true)
	node.addEventListener('focusout', focusOut)

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true)
			node.removeEventListener('focusout', focusOut)
		}
	}
}