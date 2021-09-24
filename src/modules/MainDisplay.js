import DOMFactory from "./FactoryFunctions.js";
import { createTaskForm } from "./InitDisplay.js";
import { pubsub } from "./Pubsub.js";

function getData() {
    pubsub.subscribe('addTask', log);
    pubsub.subscribe('addTask', displayTasks);
    pubsub.subscribe('deleteTaskDOM', deleteTaskDOM);
    pubsub.subscribe('addProject', log);
    pubsub.subscribe('addProject', displayProjects)
}

function log(data) {
    console.log(data);
}

function displayTasks(tasks) {
    tasks = tasks.filter(task => {
        if (document.getElementById(`${task.filteredTitle}Task`)) return false
        return true
    })
    for (const task of tasks) {
        const taskDiv = DOMFactory('div', {className: 'taskDiv', id: `${task.filteredTitle}Task`});
        const taskTitle = DOMFactory('h4', {className: 'taskTitle'});
        const taskDesc = DOMFactory('p', {className: 'taskDesc'});
        const taskDueDate = DOMFactory('p', {className: 'taskDueDate'});
        const taskDelete = DOMFactory('button', {className: 'deleteTask'});
        const projectTitle = document.querySelector('.projectTitle');

        taskTitle.textContent = task.title;
        taskDesc.textContent = task.description;
        taskDueDate.textContent = task.dueDate;
        taskDelete.textContent = "Delete Task X";

        taskDelete.addEventListener('click', (e) => pubsub.publish('deleteTask', e.target.parentNode.id))

        taskDiv.style.border = "5px solid black";
        taskDiv.style.padding = '30px';
        taskDiv.append(taskTitle, taskDesc, taskDueDate, taskDelete);
        document.body.insertBefore(taskDiv, projectTitle)
    }
}

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
            pubsub.publish('addTaskInProject', taskInProjectForm)
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