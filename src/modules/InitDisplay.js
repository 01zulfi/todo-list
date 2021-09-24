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
        this.addProjectButton.addEventListener('click', this.openProjectForm.bind(initDisplayObject));
    },
    openTaskForm: function() {
        this.taskForm.style.display = "block";
    },
    openProjectForm: function() {
        this.projectForm.style.display = "block";
    },
};

function createTaskForm(version) {
    const formSection = DOMFactory('section', {id: `section${version}Form`, className: version, style: "display: none"});
    const formObject = {
        init: function() {
            this.createElements();
            this.appendElements();
            this.bindEvents();
        },
        createElements: function() {
            this.form = DOMFactory('form', {id: `form${version}`});
            this.inputTaskTitle = DOMFactory('input', {id: `input${version}Title`, name: `inputTaskName`,
                                                       type: "text", maxLength: "50", placeholder: "task title...",
                                                       required: "true"});
            this.inputTaskDesc = DOMFactory('textarea', {id: `input${version}Desc`, name: `inputTaskDesc`,
                                                         placeholder: "desc/notes...", });
            this.inputTaskDueDate = DOMFactory('input', {id: `input${version}DueDate`, name: `inputTaskDueDate`,
                                                         type: "date",});
            this.inputTaskPriority = DOMFactory('input', {id: `input${version}Priority`, name: `inputTaskPriority`, type: "text", 
                                                          placeholder: "high/medium/low"});
            this.addTaskChecklistButton = DOMFactory('button', {id: `add${version}ChecklistButton`, type: "button", 
                                                                textContent: "Add Checklist"});
            this.submitButton = DOMFactory('button', {id: "submitButton", type: "submit", textContent: "Submit"});
        },
        appendElements: function() {
            this.form.append(this.inputTaskTitle, this.inputTaskDesc, this.inputTaskDueDate, this.inputTaskPriority,
                             this.addTaskChecklistButton, this.submitButton);
            formSection.append(this.form);
        },
        bindEvents: function() {
            this.form.addEventListener('submit', this.publishData.bind(formObject));
            this.form.addEventListener('submit', this.formFunction.bind(formObject));
            this.form.addEventListener('submit', this.deleteChecklistInputs.bind(formObject));
            this.addTaskChecklistButton.addEventListener('click', this.createChecklist.bind(formObject));
        },
        publishData: function() {
            if (version === "Task") return pubsub.publish('addTask', this.form.elements);
            if (version === "UpdateTask") return pubsub.publish('updateTask', this.form.elements);
            return pubsub.publish('addTaskInProject', this.form.elements);
        },
        formFunction: function(event) {
            event.preventDefault();
            this.form.reset();
            formSection.style.display = "none";
        },
        deleteChecklistInputs: function() {
            this.checkListInputs = document.querySelectorAll('.inputChecklist');
            this.checkListInputs.forEach(checklist => checklist.remove());
        },
        createChecklist: function() {
            this.inputTaskChecklist = DOMFactory('input', {id: `input${version}Checklist`, name: `input${version}Checklist`,
                                                           className: `inputChecklist`, type: "text",
                                                           placeholder: "enter checklist item here..."});
            this.form.insertBefore(this.inputTaskChecklist, this.submitButton);
        },

    }
    formObject.init();
    return formSection
}

function createProjectForm() {
    const formSection = DOMFactory('section', {className: "projectFormSection", style: "display: none"});
    const formObject = {
        init: function() {
            this.createElements();
            this.appendElements();
            this.bindEvents();
        },
        createElements: function() {
            this.form = DOMFactory('form', {id: "projectForm"});
            this.inputProjectTitle = DOMFactory('input', {id: "inputProjectTitle", name: "inputProjectTitle", type: "text",
                                                          placeholder: "project title...", required: "true"});
            this.inputProjectDesc = DOMFactory('textarea', {id: "inputProjectDesc", name: "inputProjectDesc",
                                                            placeholder: "desc/notes..."});
            this.inputProjectDueDate = DOMFactory('input', {id: "inputProjectDueDate", name: "inputProjectDueDate",
                                                            type: "date"});
            this.submitButton = DOMFactory('button', {id: "submitButton", type: "submit", textContent: "Submit"});
        },
        appendElements: function() {        
            this.form.append(this.inputProjectTitle, this.inputProjectDesc, this.inputProjectDueDate, this.submitButton);
            formSection.append(this.form);
        },
        bindEvents: function() {
            this.form.addEventListener('submit', this.publishData.bind(formObject));
            this.form.addEventListener('submit', this.formFunction.bind(formObject))
        },
        publishData: function() {
            pubsub.publish('addProject', this.form.elements);
        },
        formFunction: function(event) {
            event.preventDefault();
            this.form.reset();
            formSection.style.display = "none";            
        }
    }
    formObject.init();
    return formSection;
}



const pageLoadContent = () => initDisplayObject.init();

export default pageLoadContent;
export {createTaskForm};