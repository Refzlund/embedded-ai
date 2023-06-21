export function addCopyCodeEventListener() {
	document.addEventListener('click', async (event: MouseEvent) => {
		const target = event.target as HTMLElement
		if (!target?.classList?.contains('copycode'))
			return
		target.classList.add('copied')
		setTimeout(
			() => target.classList.remove('copied'),
			1000
		)
		const code = target.nextElementSibling as HTMLElement
		await navigator.clipboard.writeText(code.textContent || '')
	})
}