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
        this.form = createTaskForm();   //this.form is a <section> (not the actual form element)
    },
    setContent: function() {
    },
    appendContent: function() {
        document.body.append(this.title);
        document.body.append(this.task);
        document.body.append(this.addTaskButton);
        document.body.append(this.form);
    },
    bindEvents: function() {
        this.addTaskButton.addEventListener('click', this.openForm.bind(initDisplayObject));
        this.form.addEventListener('submit', this.formFunction.bind(initDisplayObject));
        document.querySelector("#addTaskChecklistButton").addEventListener('click', this.openChecklist.bind(initDisplayObject));
        document.querySelector("#submitTaskChecklistButton").addEventListener('click', this.closeChecklist.bind(initDisplayObject));
        document.querySelector("#submitTaskChecklistButton").addEventListener('click', this.addChecklistItem);
    },
    openForm: function() {
        this.form.style.display = "block";
    },
    formFunction: function(event) {
        this.form.firstChild.reset();
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
    const formSection = DOMFactory('section', {className: "formDiv", style: "display: none"});
    const form = DOMFactory('form', {id: "form"});
    const inputTaskTitle = DOMFactory('input', {id: "inputTaskTitle", name: "inputTaskName", type: "text", maxLength: "50",
                                                placeholder: "task title...",});
    const inputTaskDesc = DOMFactory('textarea', {id: "inputTaskDesc", name: "inputTaskDesc", placeholder: "desc/notes...", });
    const inputTaskDueDate = DOMFactory('input', {id: "inputTaskDueDate", name: "inputTaskDueDate", type: "date",})
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

const pageLoadContent = () => initDisplayObject.init();

export default pageLoadContent;