'use strict'

const toDoList = document.querySelector('.task-container')
const createNewTaskInput = document.querySelector('.input-container__input')
const inputError = document.querySelector('.input-error')

const tasks = document.getElementsByClassName('task')
const emptyStateContainer = document.getElementsByClassName('empty-state')

let taskId = 0
let inputId = 0

function emptyState() {
	const emptyState = document.createElement('div')
	emptyState.className = 'empty-state'
	emptyState.innerHTML = `
		<h2 class="empty-state__heading">Please create new task</h2>
		<div class="empty-state__option">
			<span class="empty-state__option--circle"></span>
			<p class="empty-state__option--text">Select circle or text to mark task as completed</p>
		</div>
		<div class="empty-state__option">
			<img src="./images/icon-cross.svg" alt="Delete task icon" class="empty-state__option--x-img">
			<p class="empty-state__option--text">Select cross sign to delete task</p>
		</div>
	`
	return emptyState
}

function handleState() {
	if (tasks.length === 0) {
		toDoList.insertBefore(emptyState(), toDoList.firstChild)
	}
}

const createNewTask = () => {
	if (createNewTaskInput.value !== '') {
		taskId++
		inputId++
		let newTask = document.createElement('li')
		newTask.className = 'task'
		newTask.dataset.id = taskId
		let taskDescription = createNewTaskInput.value

		newTask.innerHTML = `
		<input id="${inputId}" type="checkbox" class="task__input">
		<span class="task__circle"></span>
		<label for="${inputId}" class="task__textarea">${taskDescription}</label>
		<button class="task__delete"><img src="./images/icon-cross.svg" alt="Delete task icon" class="task__delete--x-img"></button>
		`

		toDoList.insertBefore(newTask, toDoList.firstChild)
	} else {
		if (!inputError.classList.contains('input-error-display')) {
			inputError.classList.add('input-error-display')

			setTimeout(() => {
				inputError.classList.add('input-error-hide')
			}, 2000)

			setTimeout(() => {
				inputError.classList.remove('input-error-display')
				inputError.classList.remove('input-error-hide')
			}, 2500)
		}
	}
}

const displayNewTask = event => {
	if (event.key == 'Enter') {
		createNewTask()

		if (createNewTaskInput.value !== '') {
			if (tasks.length === 1) {
				emptyStateContainer[0].remove()
			}
		}
		createNewTaskInput.value = ''
	}
}

const handleTask = e => {
	if (e.target.closest('button')) {
		deleteTask(e)

		if (tasks.length === 0) {
			toDoList.insertBefore(emptyState(), toDoList.firstChild)
		}
	}
}

function deleteTask(e) {
	const deleteSelectedTask = e.target.closest('li')
	deleteSelectedTask.remove()
}

createNewTaskInput.addEventListener('keyup', displayNewTask)
toDoList.addEventListener('click', handleTask)
handleState()
