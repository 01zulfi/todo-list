import DOMFactory from "./FactoryFunctions.js";
import { pubsub } from "./Pubsub.js";

const initDisplayObject = {
    init: function() {
        this.createElements();
        this.appendContent();
        this.bindEvents();
    },
    createElements: function() {
        this.menuAndTitleDiv = DOMFactory('div', {className: "menuAndTitleDiv"});
        this.title = DOMFactory('h2', {className: "appTitle", textContent:"T O D O"});
        this.menuButton = DOMFactory('button', {className: "menuButton", textContent: "Menu"});
        this.homeSidebar = DOMFactory('div', {className: 'sidebarDiv', textContent: 'Home'});
        this.taskSidebar = DOMFactory('div', {className: 'sidebarDiv', id: "taskSidebar",textContent: 'Tasks'});
        this.projectSidebar = DOMFactory('div', {className: "sidebarDiv", id: "projectSidebar", textContent: "Projects"});
        this.addProjectButton = DOMFactory('button', {className: "addProjectButton", textContent: "Add Project"});
        this.main = DOMFactory('div', {className: "main"});
        this.header = DOMFactory('div', {className: "header"});
        this.headerText = DOMFactory('h1', {className: "headerText", textContent: "Home"});
        //this.projectForm = createProjectForm(); //this.projectFrom is a <section> (<form> is the first child)
    },
    appendContent: function() {
        this.menuAndTitleDiv.append(this.title, this.menuButton, this.homeSidebar, this.taskSidebar, this.projectSidebar,
                                    this.addProjectButton);
        this.header.append(this.headerText);
        this.main.append(this.header);
        document.body.append(this.menuAndTitleDiv, this.main);
        //document.body.append(this.projectForm);
    },
    bindEvents: function() {
        //this.menuButton.addEventListener('click', this.openMenu.bind(initDisplayObject));
        //this.taskSidebar.addEventListener('click', this.displayTasks.bind(initDisplayObject));
        this.addProjectButton.addEventListener('click', this.openProjectForm);
    },
    openMenu: function() {
        this.menuAndTitleDiv.append(this.addProjectButton);
    },
    openProjectForm: function() {
        if (!createProjectForm()) return
        document.body.append(createProjectForm());
    },
};


function createTaskForm(version, name) {
    if (document.querySelector('.formModal')) return
    const formSection = DOMFactory('section', {id: `section${version}Form`, className: "formModal"});
    const formObject = {
        init: function() {
            this.createElements();
            this.appendElements();
            this.bindEvents();
        },
        createElements: function() {
            this.header = DOMFactory('h2', {textContent: "Create a new task"});
            this.form = DOMFactory('form', {id: `form${version}`, name: name});
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
            this.submitButton = DOMFactory('button', {id: "submitButtonTask", type: "submit", textContent: "Submit"});
        },
        appendElements: function() {
            this.form.append(this.inputTaskTitle, this.inputTaskDesc, this.inputTaskDueDate, this.inputTaskPriority,
                             this.addTaskChecklistButton, this.submitButton);
            formSection.append(this.header, this.form);
        },
        bindEvents: function() {
            this.form.addEventListener('submit', this.publishData.bind(formObject));
            this.form.addEventListener('submit', this.formFunction.bind(formObject));
            this.form.addEventListener('submit', this.deleteChecklistInputs.bind(formObject));
            this.addTaskChecklistButton.addEventListener('click', this.createChecklist.bind(formObject));
        },
        publishData: function() {
            pubsub.publish('addTask', this.form.elements);
        },
        formFunction: function(event) {
            event.preventDefault();
            this.form.reset();
            formSection.remove();
        },
        deleteChecklistInputs: function() {
            this.checklistInputs = document.querySelectorAll('.inputChecklist');
            this.checklistButtons = document.querySelectorAll('.inputTaskChecklistDelete');
            this.checklistInputs.forEach(checklist => checklist.remove());
            this.checklistButtons.forEach(button => button.remove());
        },
        createChecklist: function() {
            this.inputTaskChecklistDiv = DOMFactory('div');
            this.inputTaskChecklist = DOMFactory('input', {id: `input${version}Checklist`, name: `input${version}Checklist`,
                                                           className: `inputChecklist`, type: "text", disabled: false,
                                                           placeholder: "enter checklist item here..."});
            this.inputTaskChecklistDelete = DOMFactory('button', {className: `input${version}ChecklistDelete`, textContent: 'Del Item'});
            this.inputTaskChecklistDiv.append(this.inputTaskChecklist, this.inputTaskChecklistDelete);
            this.form.insertBefore(this.inputTaskChecklistDiv, this.submitButton);
            this.inputTaskChecklistDelete.addEventListener('click', this.deleteChecklistItem.bind(formObject));
        },
        deleteChecklistItem: function(event) {
            event.target.parentNode.remove();
        }

    }
    formObject.init();
    return formSection
}

function createProjectForm() {
    if (document.querySelector('.formModal')) return
    const formSection = DOMFactory('section', {id: "projectFormSection", className: "formModal"});
    const formObject = {
        init: function() {
            this.createElements();
            this.appendElements();
            this.bindEvents();
        },
        createElements: function() {
            this.header = DOMFactory('h2', {textContent: "Create a new project"});
            this.form = DOMFactory('form', {id: "projectForm"});
            this.inputProjectTitle = DOMFactory('input', {id: "inputProjectTitle", name: "inputProjectTitle", type: "text",
                                                          placeholder: "project title...", required: "true"});
            this.inputProjectDesc = DOMFactory('textarea', {id: "inputProjectDesc", name: "inputProjectDesc",
                                                            placeholder: "desc/notes..."});
            this.inputProjectDueDate = DOMFactory('input', {id: "inputProjectDueDate", name: "inputProjectDueDate",
                                                            type: "date"});
            this.submitButton = DOMFactory('button', {id: "submitButtonProject", type: "submit", textContent: "Submit"});
        },
        appendElements: function() {        
            this.form.append(this.inputProjectTitle, this.inputProjectDesc, this.inputProjectDueDate, this.submitButton);
            formSection.append(this.header, this.form);
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
            formSection.remove();            
        }
    }
    formObject.init();
    return formSection;
}

const pageLoadContent = () => initDisplayObject.init();

export default pageLoadContent;
export {createTaskForm};