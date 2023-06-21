import { tick } from 'svelte'
import { markedHighlight, markedImage, markedKatex, markedLink } from './marked'
import { marked } from 'marked'
import hljs from 'highlight.js'

marked.use(
	markedKatex(),
	// @ts-expect-error
	(await import('marked-xhtml')).markedXhtml(),
	// @ts-expect-error
	(await import("marked-extended-tables")).default(),
	markedHighlight,
	markedImage,
	markedLink
)

marked.use({
	mangle: false,
	gfm: false,
	headerIds: false
})

export async function applyMarkdown(el: HTMLElement, markdownString: string, showOriginal: boolean = false) {
	if (!el)
		return

	if (showOriginal) {
		el.innerHTML = `<pre class="show-original" style="border: none;"><div class="copycode">Markdown</div><code class='md language-md'>${markdownString}</code></pre>`
		await tick()
		hljs.highlightElement(el.querySelector('code') as HTMLElement)
		return
	}

	const html = marked.parse(markdownString)
	el.innerHTML = html
}