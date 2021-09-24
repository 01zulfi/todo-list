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
        this.taskForm = createTaskForm("Task");   //this.taskForm is a <section> (<form> is the first child)
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
        event.preventDefault();
        if (event.target.id === "taskForm") {
            this.taskForm.firstChild.reset();
        } else {
            this.projectForm.firstChild.reset();
        } 
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
        pubsub.publish('addChecklist', document.querySelector('#inputTaskChecklist').value);
        document.querySelector('#inputTaskChecklist').value = '';
    }
};

function createTaskForm(version) {
    const formSection = DOMFactory('section', {id: `section${version}Form`, className: version, style: "display: none"});
    const form = DOMFactory('form', {id: `form${version}`});
    const inputTaskTitle = DOMFactory('input', {id: `input${version}Title`, name: `input${version}Name`, type: "text", maxLength: "50",
                                                placeholder: "task title...", required: "true"});
    const inputTaskDesc = DOMFactory('textarea', {id: `input${version}Desc`, name: `input${version}Desc`, placeholder: "desc/notes...", });
    const inputTaskDueDate = DOMFactory('input', {id: `input${version}DueDate`, name: `input${version}DueDate`, type: "date",});
    const inputTaskPriority = DOMFactory('input', {id: `input${version}Priority`, name: `input${version}Priority`, type: "text", 
                                                   placeholder: "high/medium/low"});
    const addTaskChecklistButton = DOMFactory('button', {id: `add${version}ChecklistButton`, type: "button", 
                                                         textContent: "Add Checklist"});
    const inputTaskChecklist = DOMFactory('input', {id: `input${version}Checklist`, name: `input${version}Checklist`, type: "text",
                                                    placeholder: "enter list here...", style: "display: none;"})
    const submitTaskChecklistButton = DOMFactory('button', {id: `submit${version}ChecklistButton`, type: "button", 
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
                                                   placeholder: "project title...", required: "true"});
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
export {createTaskForm};