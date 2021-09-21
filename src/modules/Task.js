import {Title, Description, DueDate, Priority} from './FactoryFunctions.js'
import { pubsub } from './Pubsub.js';


const TaskItem = function(title, description, dueDate, priority, recurring) {
    return Object.assign({}, Title(title), Description(description),
                            DueDate(dueDate), Priority(priority))
}

const taskArray = [];

function addTask() {
    const form = document.querySelector('#form').elements;
    const task1 = TaskItem(form["inputTaskName"].value, form["inputTaskDesc"].value, form["inputTaskDueDate"].value, 
                            form["inputTaskPriority"].value);
    taskArray.push(task1);
    pubsub.publish('addTask', taskArray);
}


function bindEvent() {
    document.querySelector('form').addEventListener('submit', (e) => {
        addTask();
    })
}


export default bindEvent;