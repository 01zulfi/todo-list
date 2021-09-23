import {TaskItem} from './FactoryFunctions.js'
import { pubsub } from './Pubsub.js';

const taskArray = [];

function addTask() {
    const form = document.querySelector('#formTask').elements;
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


function bindEvent() {
    document.querySelector('#formTask').addEventListener('submit', (e) => {
        addTask();
    })
}

export default bindEvent;
export {checkDuplicateTask}