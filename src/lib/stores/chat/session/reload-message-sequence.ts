import { get } from 'svelte/store'
import { chatSession } from '.'

export function reloadMessageSequence() {
	const $session = get(chatSession)
	const $messageInfos = get($session.messageInfos)
	let info = $messageInfos[0]
	let newSequence: number[] = []
	while (info) {
		let branch = $session.branches[info.branchIndex as number]
		if (branch) {
			info = $messageInfos[branch.indexes[branch.active]]
		}
		newSequence.push(info.index)
		info = $messageInfos[info.nextMessageIndex as number]
	}
	$session.messageSequence.set(newSequence)
}