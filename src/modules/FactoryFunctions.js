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

const filteredTitle = function(title) {
    const filteredTitle = title.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s{2,}/g," ").replace(/\s+/g, '');
    return filteredTitle
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

const checklist = function(items) {
    const checklist = [];
    const itemsArray = Array.from(items);
    for (const item of itemsArray) {
        if (item.value === "") continue
        const checklistObj = {
            content: item.value,
            checked: false,
        }
        checklist.push(checklistObj);
    }
    return checklist
}

const TasksInProject = function() {
    return {tasks: []}
}

const TaskItem = function(title, description, dueDate, priority, checklistItems) {
    // const task =  Object.assign({}, Title(title), FilteredTitle(title), Description(description),
    //                          DueDate(dueDate), Priority(priority), Checklist(checkListItems), {id: Number(Date.now())});
    const task = {
        title,
        filteredTitle: filteredTitle(title),
        description,
        dueDate,
        priority,
        checklist: checklist(checklistItems),
        id: Date.now().toString(),
        done: false,
    }
    return {
        get title() {
            return task.title
        },
        set title(value) {
            task.title = value;
        },
        get description() {
            return task.description
        },
        get id() {
            return task.id
        },
        get dueDate() {
            return dueDate
        },
        task
    }
}

const ProjectItem = function(title, description, dueDate) {
    return Object.assign({}, Title(title), FilteredTitle(title), Description(description), DueDate(dueDate),
                             TasksInProject())
}

const TaskManager = function(title, description, dueDate) {
    let tasks = [];
    const project = {
        title,
        description,
        dueDate
    }
    return {
        add(task) {
            tasks = [...tasks, task];
        },
        remove(id) {
            tasks = tasks.filter(task => task.id !== id);        
        },
        find(id) {
            return tasks.find(task => task.id === id)
        },
        get taskArray() {
            return [...tasks]
        },
        get projectData() {
            return project
        },
    }
}




export {TaskItem};
export {TaskManager}
export {ProjectItem};
export default DOMFactory;