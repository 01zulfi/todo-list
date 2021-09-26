import DOMFactory from "./FactoryFunctions.js";
import { createTaskForm } from "./InitDisplay.js";
import { pubsub } from "./Pubsub.js";
import { updateTask } from "./Task.js";


function getData() {
    pubsub.subscribe('addTaskDOM', log);
    
    pubsub.subscribe('addTaskDOM', displayTasks);
    pubsub.subscribe('updateThisTask', updateTaskFormView);
    pubsub.subscribe('toggleCompleteTaskDOM', completeTaskDOM);
    //pubsub.subscribe('addProjectDOM', log);
    //pubsub.subscribe('addProjectDOM', displayProjects);
   // pubsub.subscribe('addTaskInProjectDOM', displayTaskInProject);

}

function log(data) {
    console.log(data);
}
pubsub.subscribe('initializeDOM', createProjectDOM);
function createProjectDOM(project) {
    const projectSection = DOMFactory('section', {"data-id": project.id, className: "projectSection"});
    const projectHeading = DOMFactory('h2', {className: "projectHeading", textContent: project.title});
    const addTaskInProjectButton = DOMFactory('button', {className: "addTaskInPRoject",
                                                         textContent: `Add Task in ${project.title}`});
    projectSection.append(projectHeading, addTaskInProjectButton);
    document.body.append(projectSection);
    addTaskInProjectButton.addEventListener('click', openForm);
    function openForm() {
        const formSection = createTaskForm('Task', this.parentNode.getAttribute('data-id'));
        this.parentNode.append(formSection);
    }
}


function displayTasks(project) {
    const projectSection = document.querySelector(`[data-id="${project.metaData.id}"]`);
    deleteAllTasks(projectSection);
    const tasks = project.taskArray;
    for (const task of tasks) {
        projectSection.append(createTaskCard(task));
    }
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
        init: function() {
            this.createElements();
            this.appendElements();
            this.bindEvents();
        },
        createElements: function() {
            this.taskTitle = DOMFactory('h4', {className: 'taskTitle', textContent: task.title});
            this.taskDesc = DOMFactory('p', {className: 'taskDesc', textContent: task.description});
            this.taskChecklist = createChecklistCheckbox(task.checklist);
            this.taskDueDate = DOMFactory('p', {className: 'taskDueDate', textContent: task.dueDate});
            this.taskComplete = DOMFactory('button',  {className: 'taskComplete', textContent: "Completed!"});
            this.taskDelete = DOMFactory('button', {className: 'deleteTask', textContent: "Delete Task",});
            this.taskUpdate = DOMFactory('button', {className: 'updateTask', textContent: "Update Task",});
        },
        appendElements: function() {
            taskDiv.append(this.taskTitle, this.taskDesc, this.taskChecklist, this.taskDueDate, this.taskComplete,
                           this.taskDelete, this.taskUpdate);
        },
        bindEvents: function() {
            this.taskComplete.addEventListener('click', (e) => pubsub.publish('toggleCompleteTask', e.target.parentNode.getAttribute('data-id')));
            this.taskDelete.addEventListener('click', this.deleteTaskDOM);
            this.taskUpdate.addEventListener('click',(e) => pubsub.publish('requireTask', e.target.parentNode.getAttribute('data-id')));
        },
        deleteTaskDOM: function(event) {
            pubsub.publish('deleteTask', event.target.parentNode.getAttribute('data-id'));
            event.target.parentNode.remove();
        },
    }
    taskCardObj.init();
    return taskDiv
}

function createChecklistCheckbox(checklist) { 
    const checklistDiv = DOMFactory('div', {className: 'checklistDiv'});
    for(const item of checklist) {
        const checkboxDiv = DOMFactory('div', {className: 'checkboxDiv'});  
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
    pubsub.publish('toggleChecklist', checkbox.getAttribute('data-id'));
}

function toggleLabel(checked, label) {
    if (checked) return label.style.opacity = 0.5;
    return label.style.opacity = 1;
}

function updateTaskFormView([project, task]) {
    const formSection = createTaskForm('Task', project.metaData.id);
    document.body.append(formSection);
    const form = formSection.firstChild;
    const submitButton = document.getElementById('submitButtonTask');
    form.elements[0].value = task.title;
    form.elements[1].value = task.description;
    form.elements[2].value = task.dueDate;
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
 

function displayTaskInProject() {       // INCOMPLETE

}

function displayProjects(projects) {
    for (const project of projects) {
        if (project.metaData.title === "allTasks") continue
        const projectName = DOMFactory('h3', {"data-id": project.metaData.id , className: "projectName",
                                              textContent: `${project.metaData.title}`});
        const addTaskInProjectButton = DOMFactory('button', {className: "addTaskInProjectButton",
                                                             textContent: `Add Task in ${project.metaData.title}`})
        const taskInProjectForm = createTaskForm("Project", project.metaData.id);
        addTaskInProjectButton.addEventListener('click', () => {
            document.body.append(taskInProjectForm);
        })                                     
        document.body.append(projectName, addTaskInProjectButton);
        //document.body.append(taskInProjectForm);
    }
}

export default getData;