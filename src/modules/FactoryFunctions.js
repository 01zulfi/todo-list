const DOMFactory = function(element, attributes) {  //for simple elements
    const newElement = document.createElement(element);
    for (const attribute in attributes) {
        newElement[attribute] = attributes[attribute];
    }
    return newElement
}

const Title = function(title) {
    return {title}
}

const FilteredTitle = function(title) {
    const filteredTitle = title.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s{2,}/g," ").replace(/\s+/g, '');
    return {filteredTitle}
}

const Description = function(description) {
    return {description}
}

const DueDate = function(dueDate) {
    return {dueDate}
}

const Priority = function(priority) {
    return {priority}
}

const Recurring = function(recurring) {
    if (recurring === '') return {recurring: 'no'};
    return {recurring}
}

const Checklist = function() {
    return {checklist: []}
}

const TasksInProject = function() {
    return {tasks: []}
}

const TaskItem = function(title, description, dueDate, priority) {
    return Object.assign({}, Title(title), FilteredTitle(title), Description(description),
                             DueDate(dueDate), Priority(priority), Checklist())
}

const ProjectItem = function(title, description, dueDate) {
    return Object.assign({}, Title(title), FilteredTitle(title), Description(description), DueDate(dueDate),
                             TasksInProject())
}

export {TaskItem};
export {ProjectItem};
export default DOMFactory;