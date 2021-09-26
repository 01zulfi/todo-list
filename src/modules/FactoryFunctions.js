const DOMFactory = function(element, attributes) {  //for simple elements
    const newElement = document.createElement(element);
    for (const attribute in attributes) {
        if (attribute.toString().includes('data')) {
            newElement.setAttribute(attribute.toString(), attributes[attribute]);
        } else {
            newElement[attribute] = attributes[attribute];
        }
        
    }
    return newElement
}

const uniqueId = function() {
    return Math.floor(Math.random() * Date.now()).toString()
}

const checklist = function(items) {
    const checklist = [];
    const itemsArray = Array.from(items);
    for (const item of itemsArray) {
        if (item.value === "") continue
        const checklistObj = {
            content: item.value,
            checked: item.disabled,
            id: uniqueId(),
        }
        checklist.push(checklistObj);
    }
    return checklist
}

const TaskItem = function(title, description, dueDate, priority, checklistItems) {
    const task = {
        title,
        description,
        dueDate,
        priority,
        checklist: checklist(checklistItems),
        id: uniqueId(),
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
            return task.dueDate
        },
        get checklist() {
            return task.checklist
        },
        get done() {
            return task.done
        },
        set done(value) {
            task.done = value;
        },
        task
    }
}

const TaskManager = function(title, description, dueDate) {
    const project = {
        title,
        description,
        dueDate,
        id: uniqueId(),
    }
    let tasks = [];
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
        get checklistArray() {
            const checklistArray = [];
            for (let i = 0; i < tasks.length; i++) {
                checklistArray.push(tasks[i].checklist);
            }
            return checklistArray;
        },
        get taskArray() {
            return [...tasks]
        },
        get metaData() {
            return {
                get title() {
                    return project.title
                },
                get description() {
                    return project.description
                },
                get dueDate() {
                    return project.dueDate
                },
                get id() {
                    return project.id
                },
            }
        },
    }
}

const ProjectManager = function() {
    let projects = [];
    return {
        add(project) {
            projects = [...projects, project];
        },
        remove(id) {
            projects = projects.filter(project => project.metaData.id !== id);
        },
        find(id) {
            return projects.find(project => project.metaData.id === id)
        },
        findWithTaskId(taskId) {
            return projects.find(project => project.find(taskId));
        },
        get projectArray() {
            return [...projects]
        },
    }
}

export {TaskItem};
export {TaskManager};
export {ProjectManager};
export default DOMFactory;