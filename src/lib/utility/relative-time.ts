export function formatRelativeTime(timestamp: number) {
	const seconds = Math.floor((Date.now() - timestamp) / 1000)

	if (seconds < 0) {
		return 'in the future'
	}

	const intervals = [
		// { label: 'year', seconds: 31536000 },
		// { label: 'month', seconds: 2592000 },
		{ label: 'day', seconds: 86400 },
		{ label: 'hour', seconds: 3600 },
		{ label: 'minute', seconds: 60 },
		{ label: 'second', seconds: 1 }
	]

	for (let i = 0;i < intervals.length;i++) {
		const interval = intervals[i]
		const count = Math.floor(seconds / interval.seconds)

		if (count >= 1) {
			return count === 1 ? `1 ${interval.label} ago` : `${count} ${interval.label}s ago`
		}
	}

	return 'just now'
}