'use strict'

const toDoList = document.querySelector('.task-container')
const createNewTaskInput = document.querySelector('.input-container__input') 


const tasks = document.getElementsByClassName('task')
const btn = document.querySelector('button')

function emptyState() {
	const emptyState = document.createElement('div')
	emptyState.className = 'empty-state'
	emptyState.innerHTML = `
	<div class="empty-state">
		<h2 class="empty-state__heading">Please create new task</h2>
		<div class="empty-state__option">
			<button class="empty-state__option--btn"></button>
			<p class="empty-state__option--text">Select circle to mark task as completed</p>
		</div>
		<div class="empty-state__option">
			<img src="./images/icon-cross.svg" alt="Delete task icon" class="empty-state__option--x-img">
			<p class="empty-state__option--text">Select cross sign to delete task</p>
		</div>
	</div>
	`
	return emptyState
}

function handleState() {
	if (!toDoList.contains(btn)) {
		toDoList.insertBefore(emptyState(), toDoList.firstChild)
	}
}
// handleState()

const createNewTask = () => {
	if (createNewTaskInput.value !== '') {

	} else {

	}
}