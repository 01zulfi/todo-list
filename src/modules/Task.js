import {TaskItem, TaskManager, ProjectManager} from './FactoryFunctions.js'
import { pubsub } from './Pubsub.js';

const taskModule = {
    execute: function() {
        //getLocalStorage();
        storeLocalEvent();
        listeners();
        pubsub.publish('pageLoad', allProjects.projectArray);
        pubsub.subscribe('addTask', createTask);
        pubsub.subscribe('deleteTask', deleteTask);
        pubsub.subscribe('requireEditData', sendRequiredData);
        pubsub.subscribe('toggleChecklist', toggleChecklistChecked);
        pubsub.subscribe('toggleCompleteTask', toggleCompleteTask);
        pubsub.subscribe('addProject', createProject);
        pubsub.subscribe('requireProjectForDisplay', sendRequiredProject);
    }
}

function getLocalStorage() {
    for (let i = 0; i < localStorage.length; i++) {
        const data = JSON.parse(localStorage.getItem(`Project${i}`));
        allProjects.add(data);
    }
}

function storeLocal(data) {     // TASK AND PROJECT PASSED THROUGH FACTORIES IN FUNCTIONS: createTask() createProject()
    console.log(data);          // TASK need: title desc dueDate priority checklist 
    localStorage.clear();       // PROJECT need: title desc dueDate    
    for (let i = 0; i < data.length; i++) {
        console.log(data[i].title);
        
        for (let j = 0; j < data[i].length; j++) {
            const task = localStorage.setItem
        }
        console.log(JSON.stringify(data[i]));
        localStorage.setItem(`Project${i}`, JSON.stringify(data[i]));
    }
    console.log(JSON.parse(localStorage.getItem(`Project0`)));
    //localStorage.setItem('Projects', JSON.stringify(data));
}

function storeLocalEvent() {
    window.addEventListener('click', () => storeLocal(allProjects.projectArray));
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
allProjects.add(TaskManager('All Tasks'));
console.log(allProjects.projectArray);
function createTask(form) {
    const task = TaskItem(form["inputTaskName"].value, form["inputTaskDesc"].value, form["inputTaskDueDate"].value, 
                          form["inputTaskPriority"].value, document.querySelectorAll('.inputChecklist'));
    const id = form[0].parentNode.name;
    const targetProject = allProjects.find(id);
    targetProject.add(task);
    pubsub.publish('addTaskDOM', targetProject)
}

function createProject(form) {
    const project = TaskManager(form['inputProjectTitle'].value, form['inputProjectDesc'].value, 
                                   form['inputProjectDueDate'].value);
    allProjects.add(project);
    pubsub.publish('addProjectSidebar', project.title);
}

function deleteTask(taskId) {
    const task = allProjects.findWithTaskId(taskId);
    task.remove(taskId);
}

function sendRequiredData(taskId) {
    pubsub.publish('editThisData', [allProjects.findWithTaskId(taskId), allProjects.getTaskWithTaskId(taskId)]);
    deleteTask(taskId);
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
}

function toggleCompleteTask(taskId) {
    const completedTask = allProjects.getTaskWithTaskId(taskId);
    if (completedTask.done) {
        completedTask.done = false;
    } else {
        completedTask.done = true;
    }
    pubsub.publish('toggleCompleteTaskDOM', completedTask);
}

export {taskModule};