import {TaskItem, TaskManager} from './FactoryFunctions.js'
import { pubsub } from './Pubsub.js';

const taskModule = {
    execute: function() {
        pubsub.subscribe('addTask', createTask);
        pubsub.subscribe('deleteTask', deleteTask);
        pubsub.subscribe('requireTask', sendRequiredTask);
        checkDuplicateTask();
    }
}

const allTasks = TaskManager('AllTasks');

function createTask(form) {
    const task = TaskItem(form["inputTaskName"].value, form["inputTaskDesc"].value, form["inputTaskDueDate"].value, 
                          form["inputTaskPriority"].value, document.querySelectorAll('.inputChecklist'))
    allTasks.add(task);
    pubsub.publish('addTaskDOM', allTasks.taskArray);
}

function deleteTask(deletedTask) {
    allTasks.remove(deletedTask);
}

function sendRequiredTask(requiredTask) {
    pubsub.publish('updateThisTask', allTasks.find(requiredTask));
    allTasks.remove(requiredTask);
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

export {updateTask};
export {taskModule};