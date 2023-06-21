import type { OpenAI } from './openai-chat'

export type PrependedMessage = OpenAI.Chat.Message & {
	tokens: number
}

export interface AISettings {
	aiOptions: Partial<OpenAI.Chat.Options>
	prependedMessages?: PrependedMessage[]
}

export interface AppSettings {
	/** Model used to generate title */
	titleGptModel?: OpenAI.Chat.Model | null
	gptModel?: OpenAI.Chat.Model
	possibleModels: OpenAI.Chat.Model[]
	global: AISettings
	apiKey?: string
}