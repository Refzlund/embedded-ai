import type { OpenAI } from '$lib/types/openai-chat'

export default {
	temperature: 1,
	top_p: 1,
	n: 1,
	stop: undefined,
	max_tokens: 768,
	presence_penalty: 0,
	frequency_penalty: 0,
	logit_bias: undefined
} satisfies OpenAI.Chat.Options