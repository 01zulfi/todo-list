import DOMFactory from "./FactoryFunctions.js";
import { pubsub } from "./Pubsub.js";

const initDisplayObject = {
    init: function() {
        this.createElements();
        this.setContent();
        this.appendContent();
        this.bindEvents();
    },
    createElements: function() {
        this.title = DOMFactory('h1', {className: "appTitle", textContent:"T O D O"});
        this.task = DOMFactory('h2', {className: "taskTitle", textContent: "Task"});
        this.addTaskButton = DOMFactory('button', {className: "addTaskButton", textContent: "Add Task"});
        this.taskForm = createTaskForm();   //this.taskForm is a <section> (<form> is the first child)
        this.project = DOMFactory('h2', {className: "projectTitle", textContent: "Project"});
        this.addProjectButton = DOMFactory('button', {className: "addProjectButton", textContent: "Add Project"});
        this.projectForm = createProjectForm(); //this.projectFrom is a <section> (<form> is the first child)
    },
    setContent: function() {
    },
    appendContent: function() {
        document.body.append(this.title);
        document.body.append(this.task);
        document.body.append(this.addTaskButton);
        document.body.append(this.taskForm);
        document.body.append(this.project, this.addProjectButton);
        document.body.append(this.projectForm);
    },
    bindEvents: function() {
        this.addTaskButton.addEventListener('click', this.openTaskForm.bind(initDisplayObject));
        this.taskForm.addEventListener('submit', this.formFunction.bind(initDisplayObject));
        this.addProjectButton.addEventListener('click', this.openProjectForm.bind(initDisplayObject));
        this.projectForm.addEventListener('submit', this.formFunction.bind(initDisplayObject));
        document.querySelector("#addTaskChecklistButton").addEventListener('click', this.openChecklist.bind(initDisplayObject));
        document.querySelector("#submitTaskChecklistButton").addEventListener('click', this.closeChecklist.bind(initDisplayObject));
        document.querySelector("#submitTaskChecklistButton").addEventListener('click', this.addChecklistItem);
    },
    openTaskForm: function() {
        this.taskForm.style.display = "block";
    },
    openProjectForm: function() {
        this.projectForm.style.display = "block";
    },
    formFunction: function(event) {
        this.taskForm.firstChild.reset();
        event.preventDefault();
    },
    openChecklist: function() {
        document.querySelector('#inputTaskChecklist').style.display = "block";
        document.querySelector('#submitTaskChecklistButton').style.display = "block";
    },
    closeChecklist: function() {
        
        document.querySelector('#inputTaskChecklist').style.display = "none";
        document.querySelector('#submitTaskChecklistButton').style.display = "none";
    },
    addChecklistItem: function() {
        pubsub.publish('addChecklist', document.querySelector('#inputTaskChecklist').value)
    }
};

function createTaskForm() {
    const formSection = DOMFactory('section', {className: "taskFormDiv", style: "display: none"});
    const form = DOMFactory('form', {id: "taskForm"});
    const inputTaskTitle = DOMFactory('input', {id: "inputTaskTitle", name: "inputTaskName", type: "text", maxLength: "50",
                                                placeholder: "task title...",});
    const inputTaskDesc = DOMFactory('textarea', {id: "inputTaskDesc", name: "inputTaskDesc", placeholder: "desc/notes...", });
    const inputTaskDueDate = DOMFactory('input', {id: "inputTaskDueDate", name: "inputTaskDueDate", type: "date",});
    const inputTaskPriority = DOMFactory('input', {id: "inputTaskPriority", name: "inputTaskPriority", type: "text", 
                                                   placeholder: "high/medium/low"});
    const addTaskChecklistButton = DOMFactory('button', {id: "addTaskChecklistButton", type: "button", 
                                                         textContent: "Add Checklist"});
    const inputTaskChecklist = DOMFactory('input', {id: "inputTaskChecklist", name: "inputTaskChecklist", type: "text",
                                                    placeholder: "enter list here...", style: "display: none;"})
    const submitTaskChecklistButton = DOMFactory('button', {id: "submitTaskChecklistButton", type: "button", 
                                                         textContent: "Add", style: "display: none;"});
    const submitButton = DOMFactory('button', {id: "submitButton", type: "submit", textContent: "Submit"});

    form.append(inputTaskTitle, inputTaskDesc, inputTaskDueDate, inputTaskPriority, addTaskChecklistButton,
                inputTaskChecklist, submitTaskChecklistButton, submitButton);
    formSection.append(form);
    return formSection
}

function createProjectForm() {
    const formSection = DOMFactory('section', {className: "projectFormDiv", style: "display: none"});
    const form = DOMFactory('form', {id: "projectForm"});
    const inputProjectTitle = DOMFactory('input', {id: "inputProjectTitle", name: "inputProjectTitle", type: "text",
                                                   placeholder: "project title..."});
    const inputProjectDesc = DOMFactory('textarea', {id: "inputProjectDesc", name: "inputProjectDesc",
                                                     placeholder: "desc/notes..."});
    const inputProjectDueDate = DOMFactory('input', {id: "inputProjectDueDate", name: "inputProjectDueDate", type: "date"});
    const submitButton = DOMFactory('button', {id: "submitButton", type: "submit", textContent: "Submit"});

    form.append(inputProjectTitle, inputProjectDesc, inputProjectDueDate, submitButton);
    formSection.append(form);
    return formSection;
}



const pageLoadContent = () => initDisplayObject.init();

export default pageLoadContent;