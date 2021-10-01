import { DOMFactory } from "./FactoryFunctions.js";
import { createTaskForm } from "./InitDisplay.js";
import { pubsub } from "./Pubsub.js";

const mainDisplayModule = {
    execute: function() {
        pubsub.subscribe('addTaskDOM', displayTasks);
        pubsub.subscribe('editThisData', updateTaskFormView);
        pubsub.subscribe('toggleCompleteTaskDOM', completeTaskDOM);
        pubsub.subscribe('addProjectDOM', displayProject);
        pubsub.subscribe('homeSidebarClicked', displayHome);
        pubsub.subscribe('taskSidebarClicked', displayAllTasks);
        pubsub.subscribe('projectSidebarClicked', displayAllProjects);
        pubsub.subscribe('addProjectSidebar', addProjectSidebar);
        pubsub.subscribe('toggleCompleteProjectDOM', completeProjectDOM);
    }
}

pubsub.subscribe('pageLoad', displayHome);

function displayHome(projects) {
    clearSections();
    for (const project of projects) {
        createProjectDOM(project);
        if (project.title === "All Tasks") continue
        addProjectSidebar(project.title);
    }
}

function displayAllTasks(allTasks) {
    clearSections();
    createProjectDOM(allTasks);
}

function displayProject(project) {
    clearSections();
    createProjectDOM(project);
}

function displayAllProjects(projects) {
    clearSections()
    for (const project of projects) {
        if (project.title === "All Tasks") continue
        createProjectDOM(project);
    }
}

function addProjectSidebar(projectTitle) {
    const menuAndTitleDiv = document.querySelector('.menuAndTitleDiv');
    if (document.getElementById(projectTitle)) return
    const projectTitleDiv = DOMFactory('div', {id: projectTitle, textContent: projectTitle});
    menuAndTitleDiv.append(projectTitleDiv);
    projectTitleDiv.addEventListener('click', () => document.querySelector(".headerText").textContent = projectTitle)
    projectTitleDiv.addEventListener('click', (e) => pubsub.publish('requireProjectForDisplay', e.target.id));
}


function createProjectDOM(project) {
    const main = document.querySelector('.main');
    const projectSection = DOMFactory('section', {"data-id": project.id, className: "projectSection"});
    if (project.done) {
        projectSection.style.opacity = 0.5;
    } else {
        projectSection.style.opacity = 1;
    }
    let projectHeading;
    let addTaskInProjectButton;
    let completeProjectButton;
    let deleteProjectButton;
    if (project.title === "All Tasks") {
        projectHeading = DOMFactory('h2', {className: "projectHeading", textContent: ""});
        addTaskInProjectButton = DOMFactory('button', {className: "addTaskInPRoject",
                                                             textContent: `Add Task`});
    } else {
        projectHeading = DOMFactory('h2', {className: "projectHeading", textContent: project.title});
        addTaskInProjectButton = DOMFactory('button', {className: "addTaskInProject",
                                                             textContent: `Add Task in ${project.title}`});
        completeProjectButton = DOMFactory('button', {className: "completeProjectButton",
                                                        textContent: "Complete"});
        deleteProjectButton = DOMFactory('button', {className: "deleteProjectButton", textContent: "Delete Project"});
        completeProjectButton.addEventListener('click', (e) => pubsub.publish('toggleCompleteProject',
        e.target.parentNode.getAttribute("data-id")))
        deleteProjectButton.addEventListener('click', (e) => {
            pubsub.publish('deleteProject', e.target.parentNode.getAttribute('data-id'));
            e.target.parentNode.remove();
        })
    }

    projectSection.append(projectHeading, addTaskInProjectButton, completeProjectButton || "", deleteProjectButton || "");
    main.append(projectSection);
    addTaskInProjectButton.addEventListener('click', openForm);
    function openForm() {
        if (!createTaskForm()) return
        const formSection = createTaskForm(this.parentNode.getAttribute('data-id'));
        this.parentNode.append(formSection);
    }
    if (project.taskArray.length !== 0) displayTasks(project)
}

function clearSections() {
    const main = document.querySelector('.main');
    while (main.querySelector("section")) {
        main.lastChild.remove();
    }
}

function displayTasks(project) {
    const projectSection = document.querySelector(`[data-id="${project.id}"]`);
    const taskContainer = DOMFactory('div', {className: "taskContainer"});
    deleteAllTasks(projectSection);
    const tasks = project.taskArray;
    for (const task of tasks) {
        taskContainer.append(createTaskCard(task));
    }
    projectSection.append(taskContainer);
}

function deleteAllTasks(projectSection) {
    const taskDivNodeList = projectSection.querySelectorAll('.taskDiv');
    if (taskDivNodeList) {
        taskDivNodeList.forEach(taskDiv => taskDiv.remove());
    }
}

function createTaskCard(task) {
    const taskDiv = DOMFactory('div', {className: 'taskDiv', "data-id": task.id});
    if (task.done) {
        taskDiv.style.opacity = 0.5;
    } else {
        taskDiv.style.opacity = 1;
    }
    const taskCardObj = {
        taskCountdownDiv: DOMFactory('div', {className: "countdownDiv",
                          style: "display: none"}), //declared here because this in setInterval is weird
        init: function() {
            this.createElements();
            this.appendElements();
            this.bindEvents();
            window.setInterval(this.setIntervalCountdown, 1000, task);
        },
        createElements: function() {
            this.taskTitle = DOMFactory('h4', {className: 'taskTitle', textContent: task.title});
            this.taskDesc = DOMFactory('p', {className: 'taskDesc', textContent: task.description});
            this.taskChecklist = createChecklistCheckbox(task.checklist, task);
            this.taskDueDate = DOMFactory('p', {className: 'taskDueDate', textContent: task.dueDateMessage});
            this.taskPriority = DOMFactory('p', {className: 'taskPriority', textContent: task.priority ?
                                                        `Priority: ${task.priority}`: ""});
            this.taskComplete = DOMFactory('button',  {className: 'taskComplete', textContent: "Completed!"});
            this.taskDelete = DOMFactory('button', {className: 'deleteTask', textContent: "Delete Task",});
            this.taskUpdate = DOMFactory('button', {className: 'updateTask', textContent: "Update Task",});
            this.taskCountdownButton = DOMFactory('button', {className: 'countdownTaskButton', textContent: "View Countdown"});
        },
        appendElements: function() {
            taskDiv.append(this.taskTitle, this.taskDesc, this.taskChecklist, this.taskDueDate, this.taskPriority,
                             this.taskComplete, this.taskDelete, this.taskUpdate, this.taskCountdownButton,
                             taskCardObj.taskCountdownDiv);
        },
        bindEvents: function() {
            this.taskComplete.addEventListener('click', (e) => pubsub.publish('toggleCompleteTask',
                                                                               e.target.parentNode.getAttribute('data-id')));
            this.taskDelete.addEventListener('click', this.deleteTaskDOM);
            this.taskUpdate.addEventListener('click',(e) => pubsub.publish('requireEditData',
                                                                            e.target.parentNode.getAttribute('data-id')));
            this.taskCountdownButton.addEventListener('click', this.viewCountdown.bind(taskCardObj));
        },
        deleteTaskDOM: function(event) {
            pubsub.publish('deleteTask', event.target.parentNode.getAttribute('data-id'));
            event.target.parentNode.remove();
        },
        viewCountdown: function() {
            if (this.taskCountdownDiv.style.display === "none") {
                this.taskCountdownDiv.style.display = "block";
                
            } else {
                this.taskCountdownDiv.style.display = "none";
            }
        },
        setIntervalCountdown: function(task) {
            if (taskCardObj.taskCountdownDiv.firstChild) taskCardObj.taskCountdownDiv.firstChild.remove()
            const taskCountdown = displayTaskCountdown(task);
            taskCardObj.taskCountdownDiv.append(taskCountdown);
        }
    }
    taskCardObj.init();
    return taskDiv
}

function displayTaskCountdown(task) {
    const durationObject = task.countdown();
    const years = DOMFactory('p', {textContent: `Years: ${durationObject.years}`});
    const months = DOMFactory('p', {textContent: `Months: ${durationObject.months}`});
    const days = DOMFactory('p', {textContent: `Days: ${durationObject.days}`});
    const hours = DOMFactory('p', {textContent: `Hours: ${durationObject.hours}`});
    const minutes = DOMFactory('p', {textContent: `Minutes: ${durationObject.minutes}`});
    const seconds = DOMFactory('p', {textContent: `Seconds: ${durationObject.seconds}`});
    const countdownDiv = DOMFactory('div');
    countdownDiv.append(years, months, days, hours, minutes, seconds);
    return countdownDiv
}


function createChecklistCheckbox(checklist, task) { 
    const checklistDiv = DOMFactory('div', {className: 'checklistDiv'});
    for(const item of checklist) {
        const checkboxDiv = DOMFactory('div', {className: 'checkboxDiv', "data-id": task.id});  
        const checkbox = DOMFactory('input', {type: "checkbox", id: item.id, "data-id": item.id, "pointer-events": "none"});
        const label = DOMFactory('label', {for: item.id, textContent: item.content});
        if (item.checked) {
            checkbox.checked = true;
            label.style.opacity = 0.5;
        }
        checkboxDiv.append(checkbox, label);
        checklistDiv.append(checkboxDiv);
        checkboxDiv.addEventListener('click', toggleCheckbox); 
    }
    return checklistDiv
}

function toggleCheckbox(e) {
    const checkbox = this.querySelector('input');
    const label = this.querySelector('label');
    if (checkbox.checked) {
        if (e.target.type === undefined) {
            checkbox.checked = false;
        };
    } else {
        if (e.target.type === undefined) {
            checkbox.checked = true;
        }
    }
    toggleLabel(checkbox.checked, label);
    pubsub.publish('toggleChecklist', [checkbox.getAttribute('data-id'), checkbox.parentNode.getAttribute('data-id')]);
}

function toggleLabel(checked, label) {
    if (checked) return label.style.opacity = 0.5;
    return label.style.opacity = 1;
}

function updateTaskFormView([project, task]) {
    const formSection = createTaskForm(project.id);
    document.body.append(formSection);
    const form = formSection.lastChild;
    const submitButton = document.getElementById('submitButtonTask');
    form.elements[0].value = task.title;
    form.elements[1].value = task.description;
    form.elements[2].value = task.dueDateInput;
    form.elements[3].value = task.priority;
    for (const item of task.checklist) {
        const inputTaskChecklistDiv = DOMFactory('div');
        const inputTaskChecklist = DOMFactory('input', {className: `inputChecklist`, type: "text",
                                                        value: item.content, disabled: item.checked});
        const inputTaskChecklistDelete = DOMFactory('button', {className: `inputTaskChecklistDelete`, textContent: 'Del Item'});
        inputTaskChecklistDiv.append(inputTaskChecklist, inputTaskChecklistDelete);
        form.insertBefore(inputTaskChecklistDiv, submitButton);
        inputTaskChecklistDelete.addEventListener('click', deleteChecklistItem);
    }
    function deleteChecklistItem(event) {event.target.parentNode.remove()};
}

function completeTaskDOM(task) {
    const taskDiv = document.querySelector(`[data-id="${task.id}"]`);
    if (task.done) {
        taskDiv.style.opacity = 0.5;
    } else {
        taskDiv.style.opacity = 1;
    }
}

function completeProjectDOM(project) {
    const projectSection = document.querySelector(`[data-id="${project.id}"]`);
    if (project.done) {
        projectSection.style.opacity = 0.5;
    } else {
        projectSection.style.opacity = 1;
    }
}

export { mainDisplayModule };