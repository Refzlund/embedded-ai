import { click, tooltip } from '$lib/actions'
import type { marked } from 'marked'

export const markedLink: marked.MarkedExtension = {
	renderer: {
		link(href, title, text) {
			const randomId = Math.random().toString(36).substring(7)
			requestAnimationFrame(() => {
				const el = document.getElementById(randomId) as HTMLElement
				if (!el)
					return
				tooltip(el, { text: href as string })
				click(el, async (e) => {
					if (e.button !== 0)
						return
					require('electron').shell.openExternal(href as string)
				})
			})
			return `<a id='${randomId}'>${text}</a>`
		},
	}
}