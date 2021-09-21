import DOMFactory from "./FactoryFunctions.js";

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
        this.form = createTaskForm();   //formSection: not the actual form element
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
    },
    openForm: function() {
        this.form.style.display = "block";
    },
    formFunction: function(event) {
        this.form.firstChild.reset();
        event.preventDefault();
    },
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
    const submitButton = DOMFactory('button', {id: "submitButton", type: "submit", textContent: "Submit"});

    form.append(inputTaskTitle, inputTaskDesc, inputTaskDueDate, inputTaskPriority, submitButton);
    formSection.append(form);
    return formSection
}

const pageLoadContent = () => initDisplayObject.init();

export default pageLoadContent;