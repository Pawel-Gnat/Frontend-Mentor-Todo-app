'use strict'

import changeTheme from './theme.js'
import { handleDragStart, handleDragEnd, handleDragOver, handleDrop } from './drag&drop.js'

const toDoList = document.querySelector('.tasks-box')
const newTaskInput = document.querySelector('.input-container__input')
const showError = document.querySelector('.error')
const taskButtons = [...document.querySelectorAll('.button-container button')]
const emptyState = document.querySelector('.empty-state')

let taskId = 0
let inputId = 0
let storageOfCreatedTasks = localStorage.getItem('tasks') ? parseFromLocalStorage() : []

let tasks = {
	allTasks: function () {
		return document.getElementsByClassName('task')
	},

	activeTasks: function () {
		return [...tasks.allTasks()].filter(task => !task.classList.contains('task-completed-text'))
	},

	completedTasks: function () {
		return [...tasks.allTasks()].filter(task => task.classList.contains('task-completed-text'))
	},
}

function addToLocalStorage(task) {
	localStorage.setItem('tasks', JSON.stringify(task))
}

function parseFromLocalStorage() {
	return JSON.parse(localStorage.getItem('tasks'))
}

function handleEmptyState() {
	let allTasksNumber = tasks.allTasks().length
	allTasksNumber === 0 ? emptyState.classList.remove('hide') : emptyState.classList.add('hide')
}

const newTask = text => {
	taskId++
	inputId++
	let newTask = document.createElement('li')
	newTask.className = 'task'
	newTask.setAttribute('draggable', true)
	newTask.dataset.id = taskId

	newTask.innerHTML = `
	<input id="${inputId}" type="checkbox" class="task__input">
	<span class="task__circle"><img src="./images/icon-check.svg" alt="" class="task__circle--icon" aria-hidden="true"></span>
	<label for="${inputId}" class="task__textarea">${text}</label>
	<button class="task__delete"><img src="./images/icon-cross.svg" alt="Delete task icon" class="task__delete--x-img"></button>
	`

	toDoList.insertBefore(newTask, toDoList.firstChild)

	if (!storageOfCreatedTasks.includes(text)) {
		storageOfCreatedTasks.push(text)
		addToLocalStorage(storageOfCreatedTasks)
	}
}

storageOfCreatedTasks.forEach(item => {
	newTask(item)
})

function displayError(msg) {
	const textError = document.querySelector('.error__text')

	if (!showError.classList.contains('error-display')) {
		textError.textContent = `${msg}`
		showError.classList.add('error-display')

		setTimeout(() => {
			showError.classList.add('error-hide')
		}, 2000)

		setTimeout(() => {
			showError.classList.remove('error-display')
			showError.classList.remove('error-hide')
			textError.textContent = ''
		}, 2500)
	}
}

const displayNewTask = event => {
	let emptyspace = /^\s*$/
	let inputValue = newTaskInput.value

	if (event.key !== 'Enter') {
		return
	}

	if (inputValue.match(emptyspace) || inputValue == '') {
		displayError('Please enter the content of the task')
		newTaskInput.value = ''
		return
	}

	newTask(newTaskInput.value)
	newTaskInput.value = ''
	displayNumberOfActiveTasks()
	handleEmptyState()
}

const handleTask = e => {
	if (e.target.closest('button')) {
		deleteTask(e)

		setTimeout(() => {
			handleEmptyState()
		}, 400)
	}

	if (e.target.closest('input')) {
		setTaskAsCompleted(e)
		displayNumberOfActiveTasks()
	}
}

function deleteTask(e) {
	let deleteSelectedTask = e.target.closest('li')
	deleteSelectedTask.classList.add('task-remove')

	setTimeout(() => {
		deleteSelectedTask.remove()
		displayNumberOfActiveTasks()

		let remainedTasks = storageOfCreatedTasks.filter(
			tasks => tasks !== `${e.target.closest('li').children.item(2).textContent}`
		)

		localStorage.setItem('tasks', JSON.stringify(remainedTasks))
		storageOfCreatedTasks = remainedTasks
	}, 400)
}

function setTaskAsCompleted(e) {
	const completeTask = e.target.closest('li')
	const completeTaskImg = completeTask.getElementsByClassName('task__circle')[0]

	completeTask.classList.toggle('task-completed-text')
	completeTaskImg.classList.toggle('task-completed-circle')
}

function displayNumberOfActiveTasks() {
	const currentTasksNumber = document.querySelector('.button-container__text')
	let activeArray = tasks.activeTasks()

	currentTasksNumber.textContent =
		activeArray.length === 1 ? `${activeArray.length} item left` : `${activeArray.length} items left`
}

function deleteCompletedTasks() {
	let completedArray = tasks.completedTasks()

	completedArray.forEach(task => {
		let taskValue = task.children.item(2).textContent
		task.classList.add('task-remove')

		if (storageOfCreatedTasks.includes(taskValue)) {
			storageOfCreatedTasks = storageOfCreatedTasks.filter(task => task !== taskValue)
			localStorage.setItem('tasks', JSON.stringify(storageOfCreatedTasks))
		}

		setTimeout(() => {
			task.remove()
			handleEmptyState()
		}, 400)
	})
}

taskButtons.forEach(btn => {
	// bottom task buttons handler (for all/active/completed)
	btn.addEventListener('click', () => {
		const activeBtnClass = document.querySelector('.active-btn')
		let tasksArray = [...tasks.allTasks()]
		let completedArray = tasks.completedTasks()
		let activeArray = tasks.activeTasks()

		if (activeBtnClass) {
			activeBtnClass.classList.remove('active-btn')
			tasksArray.forEach(task => {
				task.classList.remove('hide')
			})
		}

		if (btn.dataset.status == 'all') {
			btn.classList.add('active-btn')
		}

		if (btn.dataset.status == 'active') {
			if (activeArray.length > 0) {
				btn.classList.add('active-btn')
				completedArray.forEach(task => {
					task.classList.add('hide')
				})
			} else {
				displayError("There aren't any active tasks")
			}
		}

		if (btn.dataset.status == 'completed') {
			if (completedArray.length > 0) {
				btn.classList.add('active-btn')
				activeArray.forEach(task => {
					task.classList.add('hide')
				})
			} else {
				displayError("There aren't any completed tasks")
			}
		}

		if (btn.dataset.status == 'clear') {
			if (completedArray.length > 0) {
				deleteCompletedTasks()
			} else {
				displayError('Nothing to clear')
			}
		}
	})
})

tasks.activeTasks().forEach(task => {
	// drag and drop function
	task.addEventListener('dragstart', handleDragStart)
	task.addEventListener('dragover', handleDragOver)
	task.addEventListener('dragend', handleDragEnd)
	task.addEventListener('drop', handleDrop)
})

newTaskInput.addEventListener('keyup', displayNewTask)
toDoList.addEventListener('click', handleTask)
handleEmptyState()
displayNumberOfActiveTasks()
