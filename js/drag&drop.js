export function handleDragStart(e) {
	this.style.opacity = 0.4

	e.dataTransfer.effectAllowed = 'move'
	e.dataTransfer.setData('text/html', this.innerHTML)
}

export function handleDragEnd(e) {
	this.style.opacity = 1
}

export function handleDragOver(e) {
	e.preventDefault()
}

export function handleDrop(e) {
	e.preventDefault()
	e.stopPropagation()

	this.innerHTML = e.dataTransfer.getData('text/html')
	e.target.append(this.innerHTML)
}
