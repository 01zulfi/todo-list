import {TaskItem, TaskManager} from './FactoryFunctions.js'
import { pubsub } from './Pubsub.js';

const taskModule = {
    execute: function() {
        pubsub.subscribe('addTask', createTask);
        pubsub.subscribe('deleteTask', deleteTask);
        pubsub.subscribe('requireTask', sendRequiredTask);
        pubsub.subscribe('toggleChecklist', toggleChecklistChecked);
        pubsub.subscribe('toggleCompleteTask', toggleCompleteTask);
        checkDuplicateTask();
    }
}

const allTasks = TaskManager();

function createTask(form) {
    const task = TaskItem(form["inputTaskName"].value, form["inputTaskDesc"].value, form["inputTaskDueDate"].value, 
                          form["inputTaskPriority"].value, document.querySelectorAll('.inputChecklist'))
    allTasks.add(task);
    pubsub.publish('addTaskDOM', allTasks.taskArray);
}

function deleteTask(taskId) {
    allTasks.remove(taskId);
}

function sendRequiredTask(taskId) {
    pubsub.publish('updateThisTask', allTasks.find(taskId));
    allTasks.remove(taskId);
}

function toggleChecklistChecked(itemId) {
    console.log(allTasks.checklistArray);
    let targetChecklistObj;
    for (let i = 0; i < allTasks.checklistArray.length; i++) {
        targetChecklistObj = allTasks.checklistArray[i].find(item => item.id === itemId);
        if (targetChecklistObj) break
    }
    if (targetChecklistObj.checked) {
        targetChecklistObj.checked = false;
    } else {
        targetChecklistObj.checked = true;
    }
    console.log(allTasks.taskArray);
}

function toggleCompleteTask(taskId) {
    const completedTask = allTasks.find(taskId);
    if (completedTask.done) {
        completedTask.done = false;
    } else {
        completedTask.done = true;
    }
    pubsub.publish('toggleCompleteTaskDOM', completedTask);
}

function checkDuplicateTask() {
    const inputTitle = document.querySelector('#inputTaskTitle');
    inputTitle.addEventListener('input', (e) => {
        let duplicate = false;  //to remove custom validation message when not required
        for (const task of allTasks.taskArray) {
            if (e.target.value === task.title) {
                duplicate = true;
                e.target.setCustomValidity("Task with same name already exists");
            }
        }
        if (duplicate) {
            duplicate = false;
        } else {
            e.target.setCustomValidity("");  
        }
    })
}

export {taskModule};