import type { Writable } from 'svelte/store'
import type { OpenAI } from './openai-chat'
import type { AISettings } from './app'

export interface MessageInfo {
	/** Calculated tokens when finished */
	tokens: number
	
	/** Sum of the tokens prompt */
	promptTokens?: number

	/** 
	 * Estimated price based on model.
	 *
	 * Note: For input (human) prompts, the price includes all tokens in the prompt.
	*/
	estPrice: number
	
	/** Model used with this prompt */
	model: OpenAI.Chat.Model

	role: OpenAI.Chat.Role

	index: number
	prevMessageIndex: number | null
	nextMessageIndex: number | null

	branchIndex: number | null
}

export interface MessageBranch {
	indexes: number[]
	active: number
} 

export interface ChatSession {
	meta: ChatSessionMeta

	/** The total number of tokens for all AI responses */
	sumResponseTokens: number
	/** The total number of AI responses */
	responses: number
	/** The average tokens for each AI full response */
	averageResponseTokens: number

	/** The sum price of all prompts (estimation) */
	totalEstCost: number

	/** Will use global options if options not set */
	aiSettings: AISettings

	/** Last message index */
	lastMessageIndex: number | null

	branches: MessageBranch[]

	/** Every input/output message for the session */
	messages: Writable<Writable<OpenAI.Chat.Message>[]>
	messageInfos: Writable<MessageInfo[]>
	/** An array of index of currently displayed messages */
	messageSequence: Writable<number[]>
}

export interface ChatSessionMeta {
	/** @default Math.random().toString(36).substring(7) */
	id: string
	/** A human-readable title for the session */
	title: string
	createdAt: number
	modifiedAt: number
}