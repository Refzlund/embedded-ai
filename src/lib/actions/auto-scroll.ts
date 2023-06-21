import { tick } from 'svelte'
import { get, writable, type Writable } from 'svelte/store'

interface Options {
	threshold: number
	scrollSpeed: number
	scrollTop: Writable<number>
}

export function autoScroll(node: HTMLElement, options: Options) {
	let { threshold, scrollSpeed = 5, scrollTop = writable(Infinity)} = options
	
	let autoScrollDelta = 0
	let scrollBottom = 0

	function onScroll() {
		if (scrollBottom > threshold)
			autoScrollDelta = 0
		scrollTop.set(node.scrollTop)
	}

	

	const checkHeight = (oldHeight: number) => {
		setTimeout(() => {
			const newHeight = node.scrollHeight
			if (newHeight === oldHeight)
				return
			deltaScroll(oldHeight, newHeight)
		}, 0)
		const h = node.scrollHeight
		requestAnimationFrame(() => checkHeight(h))
	}

	const deltaScroll = (oldHeight: number, newHeight: number) => {
		const delta = newHeight - oldHeight
		scrollBottom = newHeight - node.scrollTop - node.clientHeight
		if (delta <= 0 || scrollBottom >= threshold) return
		autoScrollDelta += delta + 8
	}

	checkHeight(node.scrollHeight)

	const scrollToBottom = () => {
		if (isNaN(autoScrollDelta) || autoScrollDelta <= 0) return
		if (scrollBottom >= threshold) {
			autoScrollDelta = 0
			return
		}
		node.scrollBy({ top: scrollSpeed, behavior: 'auto' })
		autoScrollDelta -= scrollSpeed
	}

	const unsubscribe = scrollTop.subscribe(v => {
		if (scrollBottom >= threshold)
			autoScrollDelta = 0
		node.scroll({ top: v, behavior: 'auto' })
	})

	const timer = setInterval(scrollToBottom, 1)

	requestAnimationFrame(async () => {
		await tick()
		autoScrollDelta = 0
		node.scrollTop = get(scrollTop)
		node.addEventListener('scroll', onScroll)
		requestAnimationFrame(() => autoScrollDelta = 0)
	})

	return {
		destroy() {
			clearInterval(timer)
			unsubscribe()
			node.removeEventListener('scroll', onScroll)	
		},
		update(newOptions: Options) {
			threshold = newOptions.threshold
			scrollSpeed = newOptions.scrollSpeed
			scrollTop = newOptions.scrollTop
		}
	}
}