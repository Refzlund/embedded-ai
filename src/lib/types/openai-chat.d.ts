import type { JsonSchema } from './jsonschema'

export namespace OpenAI.Chat {
	export type Model =
		| 'gpt-3.5-turbo'
		| 'gpt-3.5-turbo-0613'
		| 'gpt-3.5-turbo-16k'
		| 'gpt-3.5-turbo-16k-0613'
		| 'gpt-4'
		| 'gpt-4-0613'
		| 'gpt-4-32k-0613'

	export type Role = 'system' | 'user' | 'assistant' | 'function'
	
	export interface Message {
		role: Role
		content?: string
		name?: string
		function_call?: Record<any, any>
	}

	export interface Function {
		name: string
		description?: string
		parameters: JsonSchema.ParameterSchema[]
	}
	
	export interface Options {
		/**
		 * What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.
		 * 
		 * We generally recommend altering this or `top_p` but not both.
		*/
		temperature: number

		/**
		 * An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.
		 * 
		 * We generally recommend altering this or `temperature` but not both.
		*/
		top_p: number

		/**
		 * How many chat completion choices to generate for each input message.
		*/
		n: number

		/**
		 * Up to 4 sequences where the API will stop generating further tokens.
		*/
		stop: string | string[] | undefined

		/**
		 * The maximum number of tokens to generate in the chat completion.
		 * 
		 * The total length of input tokens and generated tokens is limited by the model's context length.
		*/
		max_tokens: number

		/**
		 * Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
		*/
		presence_penalty: number

		/**
		 * Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
		*/
		frequency_penalty: number

		/**
		 * Modify the likelihood of specified tokens appearing in the completion.

		 * Accepts a json object that maps tokens (specified by their token ID in the tokenizer) to an associated bias value from -100 to 100. Mathematically, the bias is added to the logits generated by the model prior to sampling. The exact effect will vary per model, but values between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100 should result in a ban or exclusive selection of the relevant token.
		*/
		logit_bias: Record<string, number> | undefined

		/**
		 * A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse.
		*/
		user?: string
	}
	
	export interface Chat extends Partial<Options> {
		model: Model
		messages: Message[]

		functions?: Chat.Function[]

		/**
		 * Controls how the model responds to function calls. "none" means the model does not call a function, and responds to the end-user. "auto" means the model can pick between an end-user or calling a function. Specifying a particular function via `{"name": "my_function"}` forces the model to call that function. "none" is the default when no functions are present. "auto" is the default if functions are present.
		*/
		function_call?: 'auto' | 'none' | Record<string, string>

		/** @default false */
		stream?: boolean

		/** @default null */
		user?: string
	}
}

