'use strict'

const toDoList = document.querySelector('.tasks-box')
const createNewTaskInput = document.querySelector('.input-container__input')
const inputError = document.querySelector('.input-error')
const currentTasksNumber = document.querySelector('.button-container__text')

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
	setTimeout(() => {
		if (tasks.length === 0) {
			toDoList.insertBefore(emptyState(), toDoList.firstChild)
		}
	}, 400)
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
		<span class="task__circle"><img src="./images/icon-check.svg" alt="" class="task__circle--icon" aria-hidden="true"></span>
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
		countTasks()
	}
}

const handleTask = e => {
	if (e.target.closest('button')) {
		deleteTask(e)
		handleState()
	}

	if (e.target.closest('input')) {
		setTaskAsCompleted(e)
		countTasks()
	}
}

function deleteTask(e) {
	let deleteSelectedTask = e.target.closest('li')
	deleteSelectedTask.classList.add('task-remove')

	setTimeout(() => {
		deleteSelectedTask.remove()
		countTasks()
	}, 400)
}

function setTaskAsCompleted(e) {
	const completeTask = e.target.closest('li')
	const completeTaskImg = completeTask.getElementsByTagName('span')[0]

	completeTask.classList.toggle('task-completed-text')
	completeTaskImg.classList.toggle('task-completed-circle')
}

function countTasks() {
	let tasksArray = [...tasks]
	let activeArray = []

	if (tasks.length > 0) {
		activeArray = tasksArray.filter(task => {
			return !task.classList.contains('task-completed-text')
		})
	}

	currentTasksNumber.textContent = `${activeArray.length} items left`
}

createNewTaskInput.addEventListener('keyup', displayNewTask)
toDoList.addEventListener('click', handleTask)
handleState()
countTasks()

// media queries
// clear completed btn
// input animacja od gory
// local storage
// all active completed btny
// drag and drop
// color switcher
