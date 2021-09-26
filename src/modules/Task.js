import {TaskItem, TaskManager, ProjectManager} from './FactoryFunctions.js'
import { pubsub } from './Pubsub.js';

const taskModule = {
    execute: function() {
        pubsub.publish('initializeDOM', allTasks.metaData)
        pubsub.subscribe('addTask', createTask);
        pubsub.subscribe('deleteTask', deleteTask);
        pubsub.subscribe('requireEditData', sendRequiredData);
        pubsub.subscribe('toggleChecklist', toggleChecklistChecked);
        pubsub.subscribe('toggleCompleteTask', toggleCompleteTask);
        pubsub.subscribe('addProject', createProject);
    }
}

const allTasks = TaskManager('All Tasks');
const allProjects = ProjectManager();
allProjects.add(allTasks);
console.log(allProjects)
function createTask(form) {
    const task = TaskItem(form["inputTaskName"].value, form["inputTaskDesc"].value, form["inputTaskDueDate"].value, 
                          form["inputTaskPriority"].value, document.querySelectorAll('.inputChecklist'));
    const id = form[0].parentNode.name;
    const targetProject = allProjects.find(id);
    targetProject.add(task);
    pubsub.publish('addTaskDOM', targetProject)
}

function createProject(form) {
    console.log(form)
    const project = TaskManager(form['inputProjectTitle'].value, form['inputProjectDesc'].value, 
                                   form['inputProjectDueDate'].value);
    allProjects.add(project);
    pubsub.publish('addProjectDOM', project.metaData);
    console.log(allProjects.projectArray);
}

function deleteTask(taskId) {
    const task = allProjects.findWithTaskId(taskId);
    task.remove(taskId);
    console.log(allProjects);
}

function sendRequiredData(taskId) {
    pubsub.publish('editThisData', [allProjects.findWithTaskId(taskId), allProjects.getTaskWithTaskId(taskId)]);
    deleteTask(taskId);
}

function toggleChecklistChecked([itemId, taskId]) {
    console.log(taskId);
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