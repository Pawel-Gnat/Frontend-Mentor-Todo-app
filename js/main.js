'use strict'

import changeTheme from './theme.js'
import * as DragAndDrop from './drag&drop.js'

const toDoList = document.querySelector('.tasks-box')
const createNewTaskInput = document.querySelector('.input-container__input')
const showError = document.querySelector('.error')

const taskButtons = [
	...document.querySelectorAll('.button-container button'),
	...document.querySelectorAll('.button-container2 button'),
]

const tasks = document.getElementsByClassName('task')
const emptyStateContainer = document.getElementsByClassName('empty-state')

let taskId = 0
let inputId = 0
let arrayStorageOfTasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [] // my locally storaged tasks

localStorage.setItem('tasks', JSON.stringify(arrayStorageOfTasks))
const data = JSON.parse(localStorage.getItem('tasks')) // fetched tasks from local storage

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

const createNewTask = text => {
	// function creates a new task
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

	arrayStorageOfTasks.push(text)
	localStorage.setItem('tasks', JSON.stringify(arrayStorageOfTasks))
}

data.forEach(item => {
	// append tasks from local storage
	createNewTask(item)
})

class ErrorState {
	constructor(msg) {
		this.msg = msg
	}

	showError() {
		const textError = document.querySelector('.error__text')

		if (!showError.classList.contains('error-display')) {
			textError.textContent = `${this.msg}`
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
}

const displayNewTask = event => {
	// funciton display a created task if input value is not empty
	if (event.key == 'Enter') {
		let emptyspace = /^\s*$/
		let inputValue = createNewTaskInput.value

		if (!inputValue.match(emptyspace) && inputValue !== '') {
			createNewTask(createNewTaskInput.value)

			if (createNewTaskInput.value !== '') {
				if (emptyStateContainer.length === 1) {
					emptyStateContainer[0].remove()
				}
			}

			createNewTaskInput.value = ''
			countTasks()
		} else {
			const error = new ErrorState('Please enter the content of the task')
			error.showError()
		}
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

		let removedTask = data.filter(tasks => tasks !== `${e.target.closest('li').children.item(2).textContent}`)

		localStorage.setItem('tasks', JSON.stringify(removedTask))
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
		handleState()
	})
}

taskButtons.forEach(btn => {
	// bottom task buttons handler (for all/active/completed)
	btn.addEventListener('click', () => {
		const activeBtnClass = document.querySelector('.active-btn')
		let tasksArray = [...tasks]
		let completedArray = []
		let activeArray = []

		if (tasks.length > 0) {
			completedArray = tasksArray.filter(task => task.classList.contains('task-completed-text'))

			activeArray = tasksArray.filter(task => !task.classList.contains('task-completed-text'))
		}

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
				const error = new ErrorState("There aren't any active tasks")
				error.showError()
			}
		}

		if (btn.dataset.status == 'completed') {
			if (completedArray.length > 0) {
				btn.classList.add('active-btn')
				activeArray.forEach(task => {
					task.classList.add('hide')
				})
			} else {
				const error = new ErrorState("There aren't any completed tasks")
				error.showError()
			}
		}

		if (btn.dataset.status == 'clear') {
			if (completedArray.length > 0) {
				deleteCompletedTasks()
			} else {
				const error = new ErrorState('Nothing to clear')
				error.showError()
			}
		}
	})
})

// document.addEventListener('DOMContentLoaded', e => {
// 	// drag and drop function
// 	let allTasks = [...document.getElementsByClassName('task')]

// 	function handleDragStart(e) {
// 		this.style.opacity = 0.4

// 		e.dataTransfer.effectAllowed = 'move'
// 		e.dataTransfer.setData('text/html', this.innerHTML)
// 	}

// 	function handleDragEnd(e) {
// 		this.style.opacity = 1
// 	}

// 	function handleDragOver(e) {
// 		e.preventDefault()
// 	}

// 	function handleDrop(e) {
// 		e.preventDefault()
// 		e.stopPropagation()

// 		this.innerHTML = e.dataTransfer.getData('text/html')
// 		e.target.append(this.innerHTML)
// 	}

// 	allTasks.forEach(task => {
// 		task.addEventListener('dragstart', handleDragStart)
// 		task.addEventListener('dragover', handleDragOver)
// 		task.addEventListener('dragend', handleDragEnd)
// 		task.addEventListener('drop', handleDrop)
// 	})
;[...document.getElementsByClassName('task')].forEach(task => {
	// drag and drop function
	task.addEventListener('dragstart', DragAndDrop.handleDragStart)
	task.addEventListener('dragover', DragAndDrop.handleDragOver)
	task.addEventListener('dragend', DragAndDrop.handleDragEnd)
	task.addEventListener('drop', DragAndDrop.handleDrop)
})

createNewTaskInput.addEventListener('keyup', displayNewTask)
toDoList.addEventListener('click', handleTask)
handleState()
countTasks()

// DRY (za duzo np. let tasksArray = [...tasks])
// all/active/completed zle dziala jak zmieniam width apki oraz clear completed zabiera podswiedlenie na buttonach
// na onload apki chcialbym zeby button "all" byl jako aktywny oraz podobnie po wyczyszczeniu wszystkich taskow completed
// na telefonie nie dziala oznaczanie taska jako completed
// local storage dubluje moje taski przy appendowaniu
// drag and drop nie wczytuje taskow ktore dodaje i nadpisuje taski zamiast przesuwac
