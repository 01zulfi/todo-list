import {TaskItem} from './FactoryFunctions.js'
import { pubsub } from './Pubsub.js';

const taskArray = [];

function addTask() {
    const form = document.querySelector('#taskForm').elements;
    const newTask = TaskItem(form["inputTaskName"].value, form["inputTaskDesc"].value, form["inputTaskDueDate"].value, 
                            form["inputTaskPriority"].value);
    newTask.checklist = checklist.slice();
    taskArray.push(newTask);
    pubsub.publish('addTask', taskArray);
    checklist.splice(0);
}

const checklist = [];
pubsub.subscribe('addChecklist', addChecklist);
function addChecklist(item) {
    if (!item) return
    const itemObj = {
        content: item,
        checked: false,
    }
    checklist.push(itemObj);
}

function bindEvent() {
    document.querySelector('#taskForm').addEventListener('submit', (e) => {
        addTask();
    })
}

export default bindEvent;