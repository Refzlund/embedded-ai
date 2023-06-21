import type { OpenAI } from '$lib/types/openai-chat'
import { get, writable } from 'svelte/store'
import { chatSession } from '.'
import tokenizer from 'gpt-tokenizer/esm/encoding/cl100k_base'
import { getModelPrice } from '$lib/utils/openai-api'

export function newMessage(model: OpenAI.Chat.Model, role: OpenAI.Chat.Role, content: string, origin = -1) {

	const
		$session = get(chatSession),
		{ messages, messageInfos, messageSequence } = $session,
		$messages = get(messages),
		$messageInfos = get(messageInfos),
		$messageSequence = get(messageSequence)

	const message = writable<OpenAI.Chat.Message>({
		role,
		content
	})

	const index = $messages.push(message) - 1
	$messageSequence.push(index)

	let branchIndex = null
	if (origin >= 0) {
		const info = $messageInfos[origin]
		branchIndex = info.branchIndex as number
		if (branchIndex === null || branchIndex === undefined || branchIndex < 0) {
			branchIndex = $session.branches.push({
				indexes: [origin],
				active: 0
			}) - 1
			info.branchIndex = branchIndex
		}
		const branch = $session.branches[branchIndex]
		branch.active = branch.indexes.push(index) - 1
	}

	const lastMessageIndex = origin >= 0 ? $messageInfos[origin].prevMessageIndex : $session.lastMessageIndex

	$messageInfos.push({
		tokens: 0,
		estPrice: 0,
		index,
		model,
		branchIndex,
		prevMessageIndex: lastMessageIndex,
		nextMessageIndex: null,
		role
	})

	if (lastMessageIndex !== null) {
		$messageInfos[lastMessageIndex].nextMessageIndex = index
	}

	$session.lastMessageIndex = index

	if (origin >= 0)
		chatSession.reloadMessageSequence()

	chatSession.update(v => v)
	messages.update(v => v)
	messageInfos.update(v => v)
	messageSequence.update(v => v)

	function calculateTokens() {
		const $message = get(message)
		const tokens = tokenizer.encode($message.content || '').length
		messageInfos.update($messageInfos => {
			$messageInfos[index].tokens = tokens
			return $messageInfos
		})
	}

	function calculatePrice(
		/** When given, the estPrice will be based on this */
		promptTokens?: number
	) {
		let estPrice: number
		messageInfos.update($messageInfos => {
			const $message = get(message)
			const isOutput = $message.role === 'assistant'
			const model = $messageInfos[index].model
			const modelPrice = getModelPrice(model, !isOutput)

			estPrice = modelPrice * ((promptTokens || $messageInfos[index].tokens) / 1000)
			$messageInfos[index].estPrice = estPrice

			return $messageInfos
		})
		chatSession.update($session => {
			$session.totalEstCost += estPrice
			return $session
		})
	}

	function onHumanDone(promptTokens: number) {
		messageInfos.update($messageInfos => {
			$messageInfos[index].promptTokens = promptTokens
			return $messageInfos
		})
		calculatePrice(promptTokens)
		chatSession.saveSession()
	}

	function onAIDone() {
		calculateTokens()
		calculatePrice()
		chatSession.update($session => {
			const $messageInfos = get(messageInfos)

			$session.responses++
			$session.sumResponseTokens += $messageInfos[index].tokens
			$session.averageResponseTokens = $session.sumResponseTokens / $session.responses
			return $session
		})
		chatSession.saveSession()
	}

	return {
		message,
		index,
		onAIDone,
		onHumanDone,
		calculateTokens
	}
}