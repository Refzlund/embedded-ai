import { click, tooltip } from '$lib/actions'
import type { marked } from 'marked'
import { tick } from 'svelte'

export const markedImage: marked.MarkedExtension = {
	renderer: {
		image(href, title, text) {
			const randomId = Math.random().toString(36).substring(7)
			requestAnimationFrame(() => {
				const el = document.getElementById(randomId) as HTMLElement
				if (!el)
					return
				const { update } = tooltip(el, { text: href as string, hideOnClick: false, delay: 750, showOnClick: true })
				click(el, async (e) => {
					if (e.button !== 0)
						return
					await navigator.clipboard.writeText(href || '')
					update({ text: 'Copied!' })
					setTimeout(() => update({ text: href as string }), 1000)
				})
			})
			return `<img id='${randomId}' src='${href}' alt='${text}' />`
		},
	}
}