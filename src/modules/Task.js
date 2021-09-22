import {TaskItem} from './FactoryFunctions.js'
import { pubsub } from './Pubsub.js';

const taskArray = [];

function addTask() {
    const form = document.querySelector('#form').elements;
    const task1 = TaskItem(form["inputTaskName"].value, form["inputTaskDesc"].value, form["inputTaskDueDate"].value, 
                            form["inputTaskPriority"].value, {content: "Checklist 1", checked: true},
                             {content: "Checklist 2", checked: false,});
    
    taskArray.push(task1);
    pubsub.publish('addTask', taskArray);
}

function bindEvent() {
    document.querySelector('form').addEventListener('submit', (e) => {
        addTask();
    })
}

export default bindEvent;