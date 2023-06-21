import tokenizer from 'gpt-tokenizer/esm/encoding/cl100k_base'

export function prependedMessage(content: string) {
	return {
		tokens: tokenizer.encode(content).length, 
		content
	}
}