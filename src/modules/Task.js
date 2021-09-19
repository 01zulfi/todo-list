import {Title, Description, DueDate, Priority} from './FactoryFunctions.js'

const TaskItem = function(title, description, dueDate, priority) {
    return Object.assign({}, Title(title), Description(description),
                            DueDate(dueDate), Priority(priority))
}

function addTask() {
    const task1 = TaskItem('New task', 'Some desc/notes', '0/0/0000', 'high');
    document.querySelector('h3').before(JSON.stringify(task1));
}

function bindEventTask() {
    document.querySelectorAll('button')[0].addEventListener('click', addTask);
}

export default bindEventTask;