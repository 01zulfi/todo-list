import taskAddIcon from "../icons/taskAddIcon.svg";
import projectCompleteIcon from "../icons/projectCompleteIcon.svg";
import projectDeleteIcon from "../icons/projectDeleteIcon.svg";
import taskCompleteIcon from "../icons/taskCompleteIcon.svg";
import taskDeleteIcon from "../icons/taskDeleteIcon.svg";
import taskEditIcon from "../icons/taskEditIcon.svg";
import taskViewCountdownIcon from "../icons/taskViewCountdownIcon.svg";
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
        pubsub.subscribe('deleteProjectSidebar', deleteProjectSidebar);
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
    const newProjectSidebar = document.querySelector('.newProjectSidebar');
    if (document.getElementById(projectTitle)) return
    const projectTitleDiv = DOMFactory('div', {id: projectTitle, textContent: projectTitle});
    newProjectSidebar.append(projectTitleDiv);
    projectTitleDiv.addEventListener('click', () => document.querySelector(".headerText").textContent = "Projects")
    projectTitleDiv.addEventListener('click', (e) => pubsub.publish('requireProjectForDisplay', e.target.id));
}

function deleteProjectSidebar(projectTitle) {
    document.getElementById(projectTitle).remove();
}

function createProjectDOM(project) {
    const main = document.querySelector('.main');
    const projectSection = DOMFactory('section', {"data-id": project.id, className: "projectSection"});
    const projectButtonContainer = DOMFactory('div', {className: "projectButtonContainer"});
    const taskContainer = DOMFactory('div', {className: "taskContainer"});
    let projectHeading;
    let addTaskInProjectButton;
    let completeProjectButton;
    let deleteProjectButton;
    let completeProjectIcon;
    let addTaskInProjectIcon = DOMFactory('img', {src: taskAddIcon});
    let deleteProjectIcon;
    let projectDesc;
    if (project.title === "All Tasks") {
        projectHeading = DOMFactory('h2', {className: "projectHeading", textContent: ""});
        addTaskInProjectButton = DOMFactory('button', {className: "addTaskInProject",
                                                             textContent: `Add Task`});
        addTaskInProjectButton.append(addTaskInProjectIcon);                             
    } else {
        projectHeading = DOMFactory('h2', {className: "projectHeading", textContent: project.title});
        projectDesc = DOMFactory('p', {className: "projectDesc", textContent: project.description});
        addTaskInProjectButton = DOMFactory('button', {className: "addTaskInProject",
                                                             textContent: `Add`});
        completeProjectButton = DOMFactory('button', {className: "completeProjectButton",
                                                        textContent: "Complete"});
        completeProjectIcon = DOMFactory('img', {src: projectCompleteIcon});
        deleteProjectIcon = DOMFactory('img', {src: projectDeleteIcon});
        completeProjectButton.append(completeProjectIcon);
        deleteProjectButton = DOMFactory('button', {className: "deleteProjectButton", textContent: "Delete"});
        deleteProjectButton.append(deleteProjectIcon);
        addTaskInProjectButton.append(addTaskInProjectIcon);
        completeProjectButton.addEventListener('click', (event) => {
            pubsub.publish('toggleCompleteProject', event.currentTarget.parentNode.parentNode.getAttribute("data-id"));
        })
        deleteProjectButton.addEventListener('click', (e) => {
            pubsub.publish('deleteProject', e.currentTarget.parentNode.parentNode.getAttribute('data-id'));
            e.currentTarget.parentNode.parentNode.remove();
        })
    }
    projectButtonContainer.append(addTaskInProjectButton, completeProjectButton || "", deleteProjectButton || "")
    projectSection.append(projectHeading, projectDesc || "", projectButtonContainer, taskContainer);
    main.append(projectSection);
    addTaskInProjectButton.addEventListener('click', openForm);
    function openForm() {
        if (!createTaskForm()) return
        const formSection = createTaskForm(projectSection.getAttribute('data-id'));
        projectSection.append(formSection);
    }
    if (project.taskArray.length !== 0) {
        displayTasks(project)
    } else {
        completeProjectDOM(project);
    }
}

function clearSections() {
    const main = document.querySelector('.main');
    while (main.querySelector("section")) {
        main.lastChild.remove();
    }
}

function displayTasks(project) {
    const projectSection = document.querySelector(`[data-id="${project.id}"]`);
    const taskContainer = projectSection.querySelector('.taskContainer');
    deleteAllTasks(projectSection);
    const tasks = project.taskArray;
    projectSection.append(taskContainer);
    for (const task of tasks) {
        taskContainer.append(createTaskCard(task));
        completeTaskDOM(task);
    }
    completeProjectDOM(project);
}

function deleteAllTasks(projectSection) {
    const taskDivNodeList = projectSection.querySelectorAll('.taskDiv');
    if (taskDivNodeList) {
        taskDivNodeList.forEach(taskDiv => taskDiv.remove());
    }
}

function createTaskCard(task) {
    const taskDiv = DOMFactory('div', {className: 'taskDiv', "data-id": task.id});
    const taskCardObj = {
        taskCountdownDiv: DOMFactory('div', {className: "countdownDiv",
                          style: "display: none"}), //declared here because "this" in setInterval is weird
        init: function() {
            this.createElements();
            this.appendElements();
            this.bindEvents();
            window.setInterval(this.setIntervalCountdown, 1000, task);
        },
        createElements: function() {
            this.taskTitle = DOMFactory('h3', {className: 'taskTitle', textContent: task.title});
            this.taskDesc = DOMFactory('p', {className: 'taskDesc', textContent: task.description});
            this.taskChecklist = createChecklistCheckbox(task.checklist, task);
            this.taskDueDate = DOMFactory('p', {className: 'taskDueDate', textContent: task.dueDateMessage});
            this.taskPriority = DOMFactory('p', {className: `taskPriority ${task.priority}`, textContent: task.priority ?
                                                        `Priority: ${task.priority}`: ""});
            this.taskButtonContainer = DOMFactory('div', {className: 'taskButtonContainer'});
            this.taskComplete = DOMFactory('button',  {className: 'taskComplete'});
            this.taskCompleteIcon = DOMFactory('img', {src: taskCompleteIcon});
            this.taskDelete = DOMFactory('button', {className: 'deleteTask'});
            this.taskDeleteIcon = DOMFactory('img', {src: taskDeleteIcon});
            this.taskUpdate = DOMFactory('button', {className: 'updateTask'});
            this.taskUpdateIcon = DOMFactory('img', {src: taskEditIcon});
            this.taskCountdownButton = DOMFactory('button', {className: 'countdownTaskButton'});
            this.taskCountdownIcon = DOMFactory('img', {src: taskViewCountdownIcon});
        },
        appendElements: function() {
            this.taskComplete.append(this.taskCompleteIcon);
            this.taskDelete.append(this.taskDeleteIcon);
            this.taskUpdate.append(this.taskUpdateIcon);
            this.taskCountdownButton.append(this.taskCountdownIcon);
            this.taskButtonContainer.append(this.taskComplete, this.taskDelete, this.taskUpdate, this.taskCountdownButton)
            taskDiv.append(this.taskTitle, this.taskDesc, this.taskChecklist, this.taskDueDate, this.taskPriority,
                             this.taskButtonContainer, taskCardObj.taskCountdownDiv);
        },
        bindEvents: function() {
            this.taskComplete.addEventListener('click', (event) => pubsub.publish('toggleCompleteTask',
                                                event.currentTarget.parentNode.parentNode.getAttribute('data-id')));
            this.taskDelete.addEventListener('click', this.deleteTaskDOM);
            this.taskUpdate.addEventListener('click',(event) => pubsub.publish('requireEditData',
                                                event.currentTarget.parentNode.parentNode.getAttribute('data-id')));
            this.taskCountdownButton.addEventListener('click', this.viewCountdown.bind(taskCardObj));
        },
        deleteTaskDOM: function(event) {
            pubsub.publish('deleteTask', event.currentTarget.parentNode.parentNode.getAttribute('data-id'));
            event.currentTarget.parentNode.parentNode.remove();
        },
        viewCountdown: function() {
            this.taskCountdownButton.classList.toggle('clicked');
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
    const yearsDiv = DOMFactory('div', {className: "durationContainer"});
    const yearsText = DOMFactory('p', {textContent: `Years`});
    const yearsNumber = DOMFactory('p', {textContent: durationObject.years});
    const monthsDiv = DOMFactory('div', {className: "durationContainer"});
    const monthsText = DOMFactory('p', {textContent: `Months`});
    const monthsNumber = DOMFactory('p', {textContent: durationObject.months});
    const daysDiv = DOMFactory('div', {className: "durationContainer"});
    const daysText = DOMFactory('p', {textContent: `Days`});
    const daysNumber = DOMFactory('p', {textContent: durationObject.days});
    const hoursDiv = DOMFactory('div', {className: "durationContainer"});
    const hoursText = DOMFactory('p', {textContent: `Hours`});
    const hoursNumber = DOMFactory('p', {textContent: durationObject.hours});
    const minutesDiv = DOMFactory('div', {className: "durationContainer"});
    const minutesText = DOMFactory('p', {textContent: `Minutes`});
    const minutesNumber = DOMFactory('p', {textContent: durationObject.minutes});
    const secondsDiv = DOMFactory('div', {className: "durationContainer"});
    const secondsText = DOMFactory('p', {textContent: `Seconds`});
    const secondsNumber = DOMFactory('p', {textContent: durationObject.seconds});
    yearsDiv.append(yearsText, yearsNumber);
    monthsDiv.append(monthsText, monthsNumber);
    daysDiv.append(daysText, daysNumber);
    hoursDiv.append(hoursText, hoursNumber);
    minutesDiv.append(minutesText, minutesNumber);
    secondsDiv.append(secondsText, secondsNumber);
    const countdownDiv = DOMFactory('div');
    countdownDiv.append(yearsDiv, monthsDiv, daysDiv, hoursDiv, minutesDiv, secondsDiv);
    return countdownDiv
}

function createChecklistCheckbox(checklist, task) { 
    const checklistDiv = DOMFactory('div', {className: 'checklistDiv'});
    const checklistHeading = DOMFactory('p', {className: 'checklistDivHeading', textContent: "Checklist:"});
    if (checklist.length === 0) {
        checklistHeading.textContent = "";
        return checklistDiv;
    }
    checklistDiv.append(checklistHeading);
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
    const checklistDiv = formSection.querySelector('.inputTaskChecklistDiv');
    const closeModal = formSection.querySelector('.closeModal');
    form.elements["inputTaskName"].value = task.title;
    form.elements["inputTaskDesc"].value = task.description;
    form.elements["inputTaskDueDate"].value = task.dueDateInput;
    form.elements["inputTaskPriority"].value = task.priority;
    for (const item of task.checklist) {
        const inputTaskChecklistItemDiv = DOMFactory('div');
        const inputTaskChecklist = DOMFactory('input', {className: `inputChecklist`, type: "text",
                                                        value: item.content, disabled: item.checked});
        const inputTaskChecklistDelete = DOMFactory('button', {className: `inputTaskChecklistDelete`, textContent: 'X'});
        inputTaskChecklistItemDiv.append(inputTaskChecklist, inputTaskChecklistDelete);
        checklistDiv.append(inputTaskChecklistItemDiv);
        inputTaskChecklistDelete.addEventListener('click', deleteChecklistItem);
    }
    function deleteChecklistItem(event) {event.target.parentNode.remove()};
    closeModal.addEventListener('click', () => pubsub.publish('addTask', [form, task]));
}

function completeTaskDOM(task) {
    const taskDiv = document.querySelector(`[data-id="${task.id}"]`);
    const completeTask = document.querySelector('.taskComplete');
    const updateTask = taskDiv.querySelector('.updateTask');
    const countdownTask = taskDiv.querySelector('.countdownTaskButton');
    const checklistDiv = taskDiv.querySelector('.checklistDiv');
    if (task.done) {
        taskDiv.classList.add('complete');
        completeTask.classList.add('complete');
        updateTask.classList.add('complete');
        countdownTask.classList.add('complete');
        checklistDiv.classList.add('complete');
    } else {
        updateTask.classList.remove('complete');
        completeTask.classList.remove('complete');
        countdownTask.classList.remove('complete');
        checklistDiv.classList.remove('complete');
        taskDiv.classList.remove('complete');
    }
}

function completeProjectDOM(project) {
    if (project.title === "All Tasks") return
    const projectSection = document.querySelector(`[data-id="${project.id}"]`);
    const addTaskInProjectButton = projectSection.querySelector('.addTaskInProject');
    const completeProjectButton = projectSection.querySelector('.completeProjectButton');
    const taskContainer = projectSection.querySelector('.taskContainer');
    if (project.done) {
        projectSection.classList.add('complete');
        addTaskInProjectButton.classList.add('complete');
        completeProjectButton.classList.add('complete');
        if (taskContainer !== null) taskContainer.classList.add('complete');
    } else {
        projectSection.classList.remove('complete');
        addTaskInProjectButton.classList.remove('complete');
        completeProjectButton.classList.remove('complete');
        if (taskContainer !== null) taskContainer.classList.remove('complete');
    }
}

export { mainDisplayModule };