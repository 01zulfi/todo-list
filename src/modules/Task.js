import {Title, Description, DueDate, Priority} from './FactoryFunctions.js'

const TaskItem = function(title, description, dueDate, priority) {
    return Object.assign({}, Title(title), Description(description),
                            DueDate(dueDate), Priority(priority))
}

function addTask() {
    const task1 = TaskItem('Grocery', 'get groceries', '3/3/3333', 'high');
    document.body.append(JSON.stringify(task1));
}

function bindEvent() {
    document.querySelector('button').addEventListener('click', addTask);
}

export default bindEvent;