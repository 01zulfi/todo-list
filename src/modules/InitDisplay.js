import DOMFactory from "./FactoryFunctions";

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
        this.form = createTaskForm();
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
    },
    openForm: function() {
        this.form.style.display = "block";
    }
};


function createTaskForm() {
    const formSection = DOMFactory('section', {className: "formDiv", style: "display: none"});
    const form = DOMFactory('form', {id: "form"});
    const inputTaskTitle = DOMFactory('input', {id: "inputTaskTitle", type: "text", maxLength: "50",
                                                 placeholder: "task title...", name: "inputTaskName"});
    const inputTaskDesc = DOMFactory('textarea', {id: "inputTaskDesc", placeholder: "desc/notes...", name: "inputTaskDesc"});
    const submitButton = DOMFactory('button', {id: "submitButton", type: "submit", textContent: "Submit"});


    form.append(inputTaskTitle, inputTaskDesc, submitButton);
    formSection.append(form);
    return formSection
}



const pageLoadContent = () => initDisplayObject.init();

export default pageLoadContent;