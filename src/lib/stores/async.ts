export function asyncRequestAnimationFrame() {
	return new Promise(resolve => requestAnimationFrame(resolve))
}