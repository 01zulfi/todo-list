import { TaskItem, TaskManager, ProjectManager } from './FactoryFunctions.js'
import { pubsub } from './Pubsub.js';

const todoModule = {
    execute: function() {
        getLocalStorage();
        listeners();
        pubsub.publish('pageLoad', allProjects.projectArray);
        pubsub.subscribe('addTask', createTask);
        pubsub.subscribe('deleteTask', deleteTask);
        pubsub.subscribe('requireEditData', sendRequiredData);
        pubsub.subscribe('toggleChecklist', toggleChecklistChecked);
        pubsub.subscribe('toggleCompleteTask', toggleCompleteTask);
        pubsub.subscribe('addProject', createProject);
        pubsub.subscribe('requireProjectForDisplay', sendRequiredProject);
        pubsub.subscribe('toggleCompleteProject', toggleCompleteProject);
        pubsub.subscribe('deleteProject', deleteProject);
    }
}

function getLocalStorage() {
    if (localStorage.length === 0) return
    const localStorageKeys = Object.keys(localStorage);
    const sortedNestedArray = [];
    for (let i = 0; i <= localStorageKeys.length; i++) {
        const filtered = localStorageKeys.filter(key => key.slice(0, key.indexOf(';')).includes(`${i}`));
        if (filtered.length === 0) continue
        filtered.sort((a, b) => a.length - b.length);
        sortedNestedArray.push(filtered);
    }
    for (let i = 1; i < sortedNestedArray[0].length; i++) {
        const project = sortedNestedArray[0].slice(); 
        allProjects.findWithTitle('All Tasks').add(TaskItem(JSON.parse(localStorage.getItem(project[i]))));
    }
    for (let i = 1; i < sortedNestedArray.length; i++) {
        let taskManager;
        const project = sortedNestedArray[i].slice();
        for (let j = 0; j < project.length; j++) {
            if (j === 0) {
                taskManager = TaskManager(JSON.parse(localStorage.getItem(project[j])));
                continue
            }
            taskManager.add(TaskItem(JSON.parse(localStorage.getItem(project[j]))));
        }
        allProjects.add(taskManager);
    }
}

function extractContentFromChecklist(data) {  
    const checklistContent = [];
    const checklistChecked = []
    for (const item of data) {
        checklistContent.push(item.content);
        checklistChecked.push(item.checked);
    }
    return [checklistContent, checklistChecked]
}


function storeLocal(data) {    
    localStorage.clear();
    let i = 1;
    for (const project of data) {   
        localStorage.setItem(`Project: ${i};`, JSON.stringify([project.title, project.description, project.done]));
        let j = 1; 
        for (const task of project.taskArray) {
            localStorage.setItem(`Project: ${i}; Task: ${j}`, JSON.stringify([task.title, task.description, task.dueDateInput,
                                                                 task.priority, 
                                                                extractContentFromChecklist(task.checklist), task.done]));                     
            j++;
        }
        i++;
    }
}

function sendRequiredProject(projectTitle) {
    pubsub.publish('addProjectDOM', allProjects.findWithTitle(projectTitle));
}

function listeners() {
    const listenersObject = {
        init: function() {
            this.cacheDOM();
            this.bindEvents();
        },
        cacheDOM: function() {
            this.taskSidebar = document.getElementById('taskSidebar');
            this.projectSidebar = document.getElementById('projectSidebar');
            this.homeSidebar = document.getElementById('homeSidebar');
        },
        bindEvents: function() {
            this.taskSidebar.addEventListener('click', () => 
                    pubsub.publish('taskSidebarClicked', allProjects.findWithTitle('All Tasks')));
            this.projectSidebar.addEventListener('click', () => 
                    pubsub.publish('projectSidebarClicked', allProjects.projectArray));
            this.homeSidebar.addEventListener('click', () => 
                    pubsub.publish('homeSidebarClicked', allProjects.projectArray));
        }
    }
    listenersObject.init();
}

const allProjects = ProjectManager();
allProjects.add(TaskManager(['All Tasks']));

console.log(allProjects);

function createTask(form) {
    const task = TaskItem([form["inputTaskName"].value, form["inputTaskDesc"].value, form["inputTaskDueDate"].value, 
                          form["inputTaskPriority"].value, [document.querySelectorAll('.inputChecklist')]]);
    const id = form[0].parentNode.parentNode.getAttribute('data-id');
    const targetProject = allProjects.find(id);
    targetProject.add(task);
    pubsub.publish('addTaskDOM', targetProject);
    storeLocal(allProjects.projectArray);
}

function createProject(form) {
    const project = TaskManager([form['inputProjectTitle'].value, form['inputProjectDesc'].value]);
    allProjects.add(project);
    pubsub.publish('addProjectSidebar', project.title);
    storeLocal(allProjects.projectArray);
}

function deleteTask(taskId) {
    const task = allProjects.findWithTaskId(taskId);
    task.remove(taskId);
    storeLocal(allProjects.projectArray);
}

function sendRequiredData(taskId) {
    pubsub.publish('editThisData', [allProjects.findWithTaskId(taskId), allProjects.getTaskWithTaskId(taskId)]);
    deleteTask(taskId);
    storeLocal(allProjects.projectArray);
}

function toggleChecklistChecked([itemId, taskId]) {
    const task = allProjects.getTaskWithTaskId(taskId);
    const targetChecklistObj = task.findChecklistItem(itemId);
    console.log(task);
    if (targetChecklistObj.checked) {
        targetChecklistObj.checked = false;
    } else {
        targetChecklistObj.checked = true;
    }
    storeLocal(allProjects.projectArray);
}

function toggleCompleteTask(taskId) {
    const completedTask = allProjects.getTaskWithTaskId(taskId);
    
    if (completedTask.done) {
        completedTask.done = false;
    } else {
        completedTask.done = true;
    }
    pubsub.publish('toggleCompleteTaskDOM', completedTask);
    storeLocal(allProjects.projectArray);
}

function toggleCompleteProject(projectId) {
    const completedProject = allProjects.find(projectId);
    if (completedProject.done) {
        completedProject.done = false;
    } else {
        completedProject.done = true;
    }
    pubsub.publish('toggleCompleteProjectDOM', completedProject);
    storeLocal(allProjects.projectArray);
}

function deleteProject(projectId) {
    allProjects.remove(projectId);
    storeLocal(allProjects.projectArray);
}

export { todoModule };