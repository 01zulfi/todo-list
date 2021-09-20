import {Title, Description, DueDate, Priority} from './FactoryFunctions.js'

const TaskItem = function(title, description, dueDate, priority) {
    return Object.assign({}, Title(title), Description(description),
                            DueDate(dueDate), Priority(priority))
}

const taskArray = [];

function addTask() {
    const form = document.querySelector('#form').elements;
    const task1 = TaskItem(form["inputTaskName"].value, form["inputTaskDesc"].value);
    taskArray.push(task1);
    console.log(task1);
    console.log(taskArray);
}


function bindEvent() {
    document.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();
        addTask();
    })
}


export default bindEvent;
export {taskArray};