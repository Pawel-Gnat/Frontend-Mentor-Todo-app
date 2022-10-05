'use strict'

const toDoList = document.querySelector('.tasks-box')
const createNewTaskInput = document.querySelector('.input-container__input')
const inputError = document.querySelector('.input-error')

const taskButtons = [
	...document.querySelectorAll('.button-container button'),
	...document.querySelectorAll('.button-container2 button'),
]

const tasks = document.getElementsByClassName('task')
const emptyStateContainer = document.getElementsByClassName('empty-state')

let taskId = 0
let inputId = 0

function emptyState() {
	// display instructions how to use and application if there are no tasks created
	const emptyState = document.createElement('div')
	emptyState.className = 'empty-state'
	emptyState.innerHTML = `
		<h2 class="empty-state__heading">Please create a new task</h2>
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
	// append empty state function
	setTimeout(() => {
		if (tasks.length === 0) {
			toDoList.insertBefore(emptyState(), toDoList.firstChild)
		}
	}, 400)
}

const createNewTask = () => {
	// function creates a new task
	let emptyspace = /^\s*$/
	let inputValue = createNewTaskInput.value

	if (!inputValue.match(emptyspace) && inputValue !== '') {
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
	// funciton display a created task if input value is not empty
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
	// function search for a button inside tasks container and delete/set a complete them on click
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
	// delete task function
	let deleteSelectedTask = e.target.closest('li')
	deleteSelectedTask.classList.add('task-remove')

	setTimeout(() => {
		deleteSelectedTask.remove()
		countTasks()
	}, 400)
}

function setTaskAsCompleted(e) {
	// set as completed function
	const completeTask = e.target.closest('li')
	const completeTaskImg = completeTask.getElementsByTagName('span')[0]

	completeTask.classList.toggle('task-completed-text')
	completeTaskImg.classList.toggle('task-completed-circle')
}

function countTasks() {
	// displays information about items left (left bottom corner)
	const currentTasksNumber = document.querySelector('.button-container__text')
	let tasksArray = [...tasks]
	let activeArray = []

	if (tasks.length > 0) {
		activeArray = tasksArray.filter(task => !task.classList.contains('task-completed-text'))
	}

	activeArray.length === 1
		? (currentTasksNumber.textContent = `${activeArray.length} item left`)
		: (currentTasksNumber.textContent = `${activeArray.length} items left`)
}

function deleteCompletedTasks() {
	// delete completed task function
	let tasksArray = [...tasks]
	let completedArray = []

	if (tasks.length > 0) {
		completedArray = tasksArray.filter(task => task.classList.contains('task-completed-text'))
	}

	completedArray.forEach(task => {
		task.classList.add('task-remove')

		setTimeout(() => {
			task.remove()
		}, 400)
	})
}

// const handleTaskButtons = e => {
// 	if (e.target.closest('button')) {
// 		deleteTask(e)
// 		handleState()
// 	}
// }

taskButtons.forEach(btn => {
	// action on my task buttons
	btn.addEventListener('click', () => {
		if (btn.dataset.status == 'all') {
			btn.classList.add('active-btn')
		}

		if (btn.dataset.status == 'active') {
			btn.classList.add('active-btn')
		}

		if (btn.dataset.status == 'completed') {
			btn.classList.add('active-btn')
		}

		if (btn.dataset.status == 'clear') {
			deleteCompletedTasks()
			handleState()
		}
	})
})

createNewTaskInput.addEventListener('keyup', displayNewTask)
toDoList.addEventListener('click', handleTask)
handleState()
countTasks()

// local storage
// drag and drop
// color switcher
// active state na buttonach dolnych
