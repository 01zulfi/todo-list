import {TaskItem} from './FactoryFunctions.js'
import { pubsub } from './Pubsub.js';

const taskArray = [];

pubsub.subscribe('addTask', createTask);
function createTask(form) {
    const task = TaskItem(form["inputTaskName"].value, form["inputTaskDesc"].value, form["inputTaskDueDate"].value, 
                            form["inputTaskPriority"].value, document.querySelectorAll('.inputChecklist'));
    setTaskIndex(task);
    pushTaskInTaskArray(task);
    pubsub.publish('addTaskDOM', taskArray);
}

function pushTaskInTaskArray(task) {
    taskArray.push(task);
}

function setTaskIndex(task) {
    task.index = taskArray.length;
}

pubsub.subscribe('deleteTask', deleteTask);
function deleteTask(deletedTask) {
    const filtered = [];
    for (const task of taskArray) {
        if (!deletedTask.includes(task.filteredTitle)) {
            filtered.push(task);
        }
        else {
            pubsub.publish('deleteTaskDOM', task);
        }
    }
    taskArray.splice(0);
    taskArray.push(...filtered);
    console.log(taskArray);
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

export {checkDuplicateTask};
export {updateTask};