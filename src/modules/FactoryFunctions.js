import { compareAsc, format, intervalToDuration } from "date-fns";

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

const checklist = function([items, checked]) {
    const checklist = [];
    if (checked) {
        for (let i = 0; i< items.length; i++) {
            const checklistObj = {
                content: items[i],
                checked: checked[i],
                id: uniqueId(),
            }
            checklist.push(checklistObj);
        }
        return checklist
    }
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

function parseDate(dueDate) {
    if (!dueDate) return
    const parsed = dueDate.split(/\D/);
    return new Date(parsed[0], --parsed[1], parsed[2]);
}

const TaskItem = function([title, description, dueDate, priority, checklistItems, done]) {
    const dueDateFormatted = dueDate ? format(parseDate(dueDate), 'yyyy: do MMM, EEEE'): "";
    const compareDueDate = compareAsc(parseDate(dueDate), new Date());
    const task = {
        title,
        description,
        dueDate: dueDateFormatted,
        priority: priority || "",
        checklist: checklist(checklistItems),
        id: uniqueId(),
        done: (() => {
            if (done) return true
            return false
        })(),
    }

    return {
        get title() {
            return task.title
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
        get dueDateInput() {
            return dueDate
        },
        get dueDateMessage() {
            if (compareDueDate === -1) return `${task.dueDate} (Due date already passed)`
            return task.dueDate
        }, 
        countdown() {
            if (!dueDate || compareDueDate === -1) {
                return {years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0}
            }
            const durationObject = intervalToDuration({
                start: new Date(),
                end: parseDate(`${dueDate}`),
            })
            return durationObject
        },
        get checklist() {
            return task.checklist
        },
        get priority() {
            return task.priority
        },
        findChecklistItem(id) {
            return task.checklist.find(item => item.id === id)
        },
        get done() {
            return task.done
        },
        set done(value) {
            task.done = value;
        },
    }
}

const TaskManager = function([title, description, done]) {
    const project = {
        title,
        description,
        done: (() => {
            if (done) return true
            return false
        })(),
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
        get taskArray() {
            return [...tasks]
        },
        get title() {
            return project.title
        },
        get description() {
            return project.description
        },
        get id() {
            return project.id
        },
        get done() {
            return project.done
        },
        set done(value) {
            project.done = value;
        }
    }
}

const ProjectManager = function() {
    let projects = [];
    return {
        add(project) {
            projects = [...projects, project];
        },
        remove(id) {
            projects = projects.filter(project => project.id !== id);
        },
        find(id) {
            return projects.find(project => project.id === id)
        },
        findWithTitle(title) {
            return projects.find(project => project.title === title)
        },
        findWithTaskId(taskId) {
            return projects.find(project => project.find(taskId));
        },
        getTaskWithTaskId(taskId) {
            return this.findWithTaskId(taskId).find(taskId)
        },
        get projectArray() {
            return [...projects]
        },
    }
}

export { DOMFactory, TaskItem, TaskManager, ProjectManager };