import DOMFactory from "./FactoryFunctions.js";
import { createTaskForm } from "./InitDisplay.js";
import { pubsub } from "./Pubsub.js";
import { updateTask } from "./Task.js";


function getData() {
    pubsub.subscribe('addTaskDOM', log);
    pubsub.subscribe('addTaskDOM', displayTasks);
    pubsub.subscribe('deleteTaskDOM', deleteTaskDOM);
    pubsub.subscribe('updateThisTask', updateTaskFormView);
    pubsub.subscribe('updateThisTask', updateTaskFormSubmit);
    pubsub.subscribe('updateTaskDOM', displayTasks);
    pubsub.subscribe('addProjectDOM', log);
    pubsub.subscribe('addProjectDOM', displayProjects)
}

function log(data) {
    console.log(data);
}

function displayTasks(tasks) {
    deleteTasks();
    const projectTitle = document.querySelector('.projectTitle');
    for (const task of tasks) {
        document.body.insertBefore(createTaskCard(task), projectTitle)
    }
}

function deleteTasks() {
    const taskDivNodeList = document.querySelectorAll('.taskDiv');
    if (taskDivNodeList) {
        taskDivNodeList.forEach(taskDiv => taskDiv.remove());
    }
}

function createTaskCard(task) {
    const taskDiv = DOMFactory('div', {className: 'taskDiv', id: `${task.filteredTitle}Task`});
    const taskCardObj = {
        init: function() {
            this.createElements();
            this.appendElements();
            this.bindEvents();
        },
        createElements: function() {
            this.taskTitle = DOMFactory('h4', {className: 'taskTitle', textContent: task.title});
            this.taskDesc = DOMFactory('p', {className: 'taskDesc', textContent: task.description});
            this.taskDueDate = DOMFactory('p', {className: 'taskDueDate', textContent: task.dueDate});
            this.taskDelete = DOMFactory('button', {className: 'deleteTask', textContent: "Delete Task"});
            this.taskUpdate = DOMFactory('button', {className: 'updateTask', textContent: "Update Task"});
        },
        appendElements: function() {
            taskDiv.append(this.taskTitle, this.taskDesc, this.taskDueDate, this.taskDelete, this.taskUpdate);
        },
        bindEvents: function() {
            this.taskDelete.addEventListener('click', (e) => pubsub.publish('deleteTask', e.target.parentNode.id));
            this.taskUpdate.addEventListener('click',(e) => pubsub.publish('requireTask', e.target.parentNode.id));
        },
    }
    taskCardObj.init();
    return taskDiv
}

function updateTaskFormView(task) {
    const formSection = createTaskForm('UpdateTask');
    formSection.style.display = "block";
    const form = formSection.firstChild;
    form.elements[0].value = task.title;
    form.elements[1].value = task.description;
    form.elements[2].value = task.dueDate;
    form.elements[3].value = task.priority;
    document.body.append(formSection);
}

function updateTaskFormSubmit(task) {
    document.querySelector('.UpdateTask').firstChild.addEventListener('submit', (e) => {
        e.preventDefault();
        updateTask(task, document.querySelector('.UpdateTask'));
        document.querySelector('.UpdateTask').remove();
    })
}

// function updateTaskDOM(updatedTask, task) {
//     const taskDivNodeList = Array.from(document.querySelector('.taskDiv'));
//     for (const taskDiv of taskDivNodeList) {
//         if (taskDiv.id.includes(task.filteredTitle)) {

//         }
//     }
// }


function deleteTaskDOM(task) {
    const taskDivNodeList = Array.from(document.querySelectorAll('.taskDiv'));
    for (const taskDiv of taskDivNodeList) {
        if (taskDiv.id.includes(task.filteredTitle)) {
            taskDiv.remove();
            break;
        }
    }
}




function displayProjects(projects) {            // NEED FIX FOR NAMES WITH SAME ALPHABETS DIFFERENT PUNCTUATION
    projects = projects.filter(project => { 
        if (document.getElementById(`${project.filteredTitle}Project`)) return false
        return true
    })
    for (const project of projects) {
        const projectName = DOMFactory('h3', {id: `${project.filteredTitle}Project`, className: "projectName",
                                              textContent: `${project.title}`});
        const addTaskInProjectButton = DOMFactory('button', {id: `${project.filteredTitle} button`,
                                                             textContent: `Add Task in ${project.title}`})
        const taskInProjectForm = createTaskForm(`TaskIn${project.filteredTitle}`);
        taskInProjectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            //pubsub.publish('addTaskInProject', taskInProjectForm)
            e.target.reset();
            
        })
        addTaskInProjectButton.addEventListener('click', () => {
            taskInProjectForm.style.display = "block";
        })       
                                       
        document.body.append(projectName, addTaskInProjectButton);
        document.body.append(taskInProjectForm);
        document.getElementById(`addTaskIn${project.filteredTitle}ChecklistButton`).addEventListener('click', () => {
            document.querySelector(`#inputTaskIn${project.filteredTitle}Checklist`).style.display = "block";
            document.querySelector(`#submitTaskIn${project.filteredTitle}ChecklistButton`).style.display = "block";
        })
        document.getElementById(`submitTaskIn${project.filteredTitle}ChecklistButton`).addEventListener('click', () => {
            document.querySelector(`#inputTaskIn${project.filteredTitle}Checklist`).style.display = "none";
            document.querySelector(`#submitTaskIn${project.filteredTitle}ChecklistButton`).style.display = "none";
            pubsub.publish('addChecklistInTaskInProject',
                            document.querySelector(`#inputTaskIn${project.filteredTitle}Checklist`).value);
            document.querySelector(`#inputTaskIn${project.filteredTitle}Checklist`).value = '';
        })
    }
}




export default getData;