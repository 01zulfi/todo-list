import {TaskItem, TaskManager} from './FactoryFunctions.js'
import { pubsub } from './Pubsub.js';

const taskModule = {
    execute: function() {
        pubsub.subscribe('addTask', createTask);
        pubsub.subscribe('deleteTask', deleteTask);

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

pubsub.subscribe('requireTask', sendRequiredTask);
function sendRequiredTask(requiredTask) {
    for (const task of taskArray) {
        if (requiredTask.includes(task.filteredTitle)) {
            pubsub.publish('updateThisTask', task);
            break
        }
    }
}

function updateTask(task, form) {
    const data = form.firstChild;
    const updatedTask = TaskItem(data[0].value, data[1].value, data[2].value, data[3].value);
    updatedTask.index = task.index;
    taskArray.splice(task.index, 1, updatedTask);
    pubsub.publish('updateTaskDOM', taskArray);
    console.log(taskArray);
}

function checkDuplicateTask() {
    document.querySelector('#inputTaskTitle').addEventListener('input', (e) => {
        let count = 0;  //to remove custom validation message when not required
        for (const task of taskArray) {
            if (e.target.value === task.title) {
                count++;
                e.target.setCustomValidity("Project with same name already exists");
            }
        }
        if (count === 0) {
            e.target.setCustomValidity("");
        } else {
            count = 0;  
        }
    })
}

//export {checkDuplicateTask};
export {updateTask};
export {taskModule};