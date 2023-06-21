import { click, tooltip } from '$lib/actions'
import katex from 'katex'
import type { marked } from 'marked'

type KatexOptions = Parameters<typeof katex['renderToString']>[1]
type Token = marked.Token & { text: string }

export function markedKatex(options: KatexOptions = {}) {
	return {
		extensions: [
			inlineKatex(options),
			blockKatex(options)
		]
	} as marked.MarkedExtension
}

function tooltipContents(randomId: string) {
	requestAnimationFrame(() => {
		const el = document.getElementById(randomId) as HTMLElement
		if (!el)
			return
		const annotation = el.querySelector('annotation') as HTMLElement
		const text = '$$' + annotation.textContent as string + '$$'
		const { update } = tooltip(el, { text, hideOnClick: false, delay: 750, showOnClick: true })
		click(el, async (e) => {
			if (e.button !== 0)
				return
			update({ text: 'Copied!' })
			await navigator.clipboard.writeText(text)
			setTimeout(() => update({ text }), 1000)
		})
	})
}

function inlineKatex(options: KatexOptions) {
	return {
		name: 'inlineKatex',
		level: 'inline',
		start(src: string) { return src.indexOf('$') },
		tokenizer(src: string, tokens: Token[]) {
			const match = src.match(/^\$+([^$\n]+?)\$+/)
			if (match) {
				return {
					type: 'inlineKatex',
					raw: match[0],
					text: match[1].trim()
				}
			}
		},
		renderer(token: Token & { text: string }) {
			const str = katex.renderToString(token.text, options)
			const randomId = Math.random().toString(36).substring(7)
			tooltipContents(randomId)
			return `<span id='${randomId}'>${str}</span>`
		}
	}
}

function blockKatex(options: KatexOptions) {
	return {
		name: 'blockKatex',
		level: 'block',
		start(src: string) { return src.indexOf('\n$$') },
		tokenizer(src: string, tokens: Token[]) {
			const match = src.match(/^\$\$+\n([^$]+?)\n\$\$+\n/)
			if (match) {
				return {
					type: 'blockKatex',
					raw: match[0],
					text: match[1].trim()
				}
			}
		},
		renderer(token: Token & { text: string }) {
			const randomId = Math.random().toString(36).substring(7)
			const str = `<p id='${randomId}'>${katex.renderToString(token.text, options)}</p>`
			tooltipContents(randomId)
			return str
		}
	}
}