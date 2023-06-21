import type { marked } from 'marked'
import hljs from 'highlight.js'
import langmap from './highlight-language-map.json'

export const markedHighlight: marked.MarkedExtension = {
	renderer: {
		code(code, language: string, isEscaped) {
			const lowercaseLanguage = language.toLowerCase() as keyof typeof langmap
			let lang = langmap[lowercaseLanguage] || ''
			code = hljs.highlight(code, { language: language || 'plaintext' }).value
			if (lang.length > 0)
				lang = `<div class='copycode'>${lang}</div>`
			
			return `
					<pre>
						${lang}
						<code class='hljs language-${language}'>${isEscaped ? escape.handler(code, true) : code}</code>
					</pre>
				`
		},
	},
	hooks: {
		preprocess(markdown) {
			const len = markdown.match(/```/g)?.length || 0
			if (len % 2 !== 0)
				return markdown + '```'
			return markdown
		},
	}
}

const escape = {
	replacementMap: {
		'"': '&quot;',
		"'": '&#39;',
		'<': '&lt;',
		'>': '&gt;',
		'&': '&amp;'
	},
	handler(html: string, encode: boolean) {
		let regex = encode ? /[&<>"']/ : /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/
		if (regex.test(html)) {
			return html.replace(
				new RegExp(regex.source, 'g'),
				(ch: string) => escape.replacementMap[ch as keyof typeof escape.replacementMap]
			)
		}
		return html
	}
}