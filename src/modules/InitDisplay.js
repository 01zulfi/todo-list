import todoListIcon from "../icons/todoListIcon.svg";
import projectAddIcon from "../icons/projectAddIcon.svg";
import { DOMFactory } from "./FactoryFunctions.js";
import { pubsub } from "./Pubsub.js";

const initDisplayModule = {
    execute: function() {
        initDisplayObject.init();
    },
}

const initDisplayObject = {
    init: function() {
        this.createElements();
        this.appendContent();
        this.bindEvents();
    },
    createElements: function() {
        this.favicon = DOMFactory('link', {type: "image/png", rel: "icon", href: todoListIcon});
        this.menuAndTitleDiv = DOMFactory('div', {className: "menuAndTitleDiv"});
        this.appTitleDiv = DOMFactory('div');
        this.title = DOMFactory('h2', {className: "appTitle", textContent:"T O D O"});
        this.sidebarMain = DOMFactory('div', {className: "sidebarMain"});
        this.homeSidebar = DOMFactory('div', {className: 'sidebarDiv selected', id: "homeSidebar", textContent: 'Home'});
        this.taskSidebar = DOMFactory('div', {className: 'sidebarDiv', id: "taskSidebar",textContent: 'Tasks'});
        this.projectSidebar = DOMFactory('div', {className: "sidebarDiv", id: "projectSidebar", textContent: "Projects"});
        this.addProjectButton = DOMFactory('button', {className: "addProjectButton", textContent: "Add Project"});
        this.projectAddIcon = DOMFactory('img', {src: projectAddIcon});
        this.newProjectSidebar = DOMFactory('div', {className: 'newProjectSidebar'})
        this.main = DOMFactory('div', {className: "main"});
        this.header = DOMFactory('div', {className: "header"});
        this.headerText = DOMFactory('h1', {className: "headerText", textContent: "Home"});
    },
    appendContent: function() {
        document.head.append(this.favicon);
        this.addProjectButton.append(this.projectAddIcon);
        this.appTitleDiv.append(this.title);
        this.sidebarMain.append(this.homeSidebar, this.taskSidebar, this.projectSidebar);
        this.menuAndTitleDiv.append(this.appTitleDiv, this.sidebarMain, this.addProjectButton, this.newProjectSidebar);
        this.header.append(this.headerText);
        this.main.append(this.header);
        document.body.append(this.menuAndTitleDiv, this.main);
    },
    bindEvents: function() {
        this.homeSidebar.addEventListener('click', this.changeHeader.bind(initDisplayObject));
        this.taskSidebar.addEventListener('click', this.changeHeader.bind(initDisplayObject));
        this.sidebarMain.addEventListener('click', this.toggleSelected.bind(initDisplayObject));
        this.newProjectSidebar.addEventListener('click', this.toggleSelected.bind(initDisplayObject));
        this.projectSidebar.addEventListener('click', this.changeHeader.bind(initDisplayObject));
        this.addProjectButton.addEventListener('click', this.openProjectForm);
    },
    changeHeader: function(event) {
        this.headerText.textContent = event.target.textContent;
    },
    toggleSelected: function(event) {
        if (event.target.id === "homeSidebar") {
            this.homeSidebar.classList.add('selected');
            this.taskSidebar.classList.remove('selected');
            this.projectSidebar.classList.remove('selected');
        }
        if (event.target.id === 'taskSidebar') {
            this.homeSidebar.classList.remove('selected');
            this.taskSidebar.classList.add('selected');
            this.projectSidebar.classList.remove('selected');
        }
        if (event.target.id === 'projectSidebar' || event.target.parentNode.classList.contains('newProjectSidebar')) {
            this.homeSidebar.classList.remove('selected');
            this.taskSidebar.classList.remove('selected');
            this.projectSidebar.classList.add('selected');
        }
    },
    openProjectForm: function() {
        if (!createProjectForm()) return
        document.body.append(createProjectForm());
    },
};

function createTaskForm(projectId) {
    if (document.querySelector('.formModal')) return
    const formSection = DOMFactory('section', {id: `sectionTaskForm`, className: "formModal"});
    const formObject = {
        init: function() {
            this.createElements();
            this.appendElements();
            this.bindEvents();
        },
        createElements: function() {
            this.closeButton = DOMFactory('span', {className: "closeModal", textContent: 'Close'})
            this.header = DOMFactory('h2', {textContent: "Create a new task"});
            this.form = DOMFactory('form', {id: `formTask`, "data-id": projectId});
            this.formContainerOne = DOMFactory('div', {className: 'formContainerOne'});
            this.formContainerTwo = DOMFactory('div', {className: 'formContainerTwo'});
            this.inputTaskTitle = DOMFactory('input', {id: `inputTaskTitle`, name: `inputTaskName`,
                                                       type: "text", maxLength: "50", placeholder: "task title...",
                                                       required: "true"});
            this.labelTitle = DOMFactory('label', {for: "inputTaskTitle", textContent: "Task Title (required):"});
            this.inputTaskDesc = DOMFactory('textarea', {id: `inputTaskDesc`, name: `inputTaskDesc`,
                                                         placeholder: "desc/notes...", maxLength: "500"});
            this.labelDesc = DOMFactory('label', {for: "inputTaskDesc", textContent: "Desc/Notes:"});
            this.inputTaskDueDate = DOMFactory('input', {id: `inputTaskDueDate`, name: `inputTaskDueDate`,
                                                         type: "date"});
            this.labelDueDate = DOMFactory('label', {for: "inputTaskDueDate", textContent: "Due Date:"});
            this.inputTaskPriority = DOMFactory('input', {id: `inputTaskPriority`, name: `inputTaskPriority`,
                                                         'list': "priorities", placeholder: 'High/Medium/Low'});
            this.datalistPriorities = DOMFactory('datalist', {id: "priorities"});
            this.highOption = DOMFactory('option', {value: "High"});
            this.mediumOption = DOMFactory('option', {value: "Medium"});
            this.lowOption = DOMFactory('option', {value: "Low"});
            this.labelPriority = DOMFactory('label', {for: "inputTaskPriority", textContent: "Priority: "});
            this.addTaskChecklistButton = DOMFactory('button', {id: `addTaskChecklistButton`, type: "button", 
                                                                textContent: "Add Checklist"});
            this.inputTaskChecklistDiv = DOMFactory('div', {className: 'inputTaskChecklistDiv'});                                                    
            this.submitButton = DOMFactory('button', {id: "submitButtonTask", type: "submit", textContent: "Submit"});
        },
        appendElements: function() {
            this.datalistPriorities.append(this.highOption, this.mediumOption, this.lowOption);
            this.inputTaskChecklistDiv.append(this.addTaskChecklistButton);
            this.formContainerOne.append(this.labelTitle, this.inputTaskTitle, this.labelDueDate, this.inputTaskDueDate,
                                         this.labelPriority, this.inputTaskPriority, this.datalistPriorities);
            this.formContainerTwo.append(this.labelDesc, this.inputTaskDesc, this.inputTaskChecklistDiv, this.submitButton);
            this.form.append(this.formContainerOne, this.formContainerTwo);
            formSection.append(this.closeButton, this.header, this.form);
        },
        bindEvents: function() {
            this.closeButton.addEventListener('click', this.closeModal.bind(formObject));
            this.form.addEventListener('submit', this.publishData.bind(formObject));
            this.form.addEventListener('submit', this.formFunction.bind(formObject));
            this.form.addEventListener('submit', this.deleteChecklistInputs.bind(formObject));
            this.addTaskChecklistButton.addEventListener('click', this.createChecklist.bind(formObject));
        },
        closeModal: function() {
            formSection.remove();
        },
        publishData: function() {
            pubsub.publish('addTask', [this.form.elements]);
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
            this.inputTaskChecklistItemDiv = DOMFactory('div');
            this.inputTaskChecklist = DOMFactory('input', {name: `inputTaskChecklist`,
                                                           className: `inputChecklist`, type: "text", disabled: false,
                                                           placeholder: "enter checklist item here..."});
            this.inputTaskChecklistDelete = DOMFactory('button', {className: `inputTaskChecklistDelete`, textContent: 'X'});
            this.inputTaskChecklistItemDiv.append(this.inputTaskChecklist, this.inputTaskChecklistDelete);
            this.inputTaskChecklistDiv.append(this.inputTaskChecklistItemDiv)
            this.inputTaskChecklistDelete.addEventListener('click', this.deleteChecklistItem.bind(formObject));
        },
        deleteChecklistItem: function(event) {
            event.target.parentNode.remove();
        },
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
            this.closeButton = DOMFactory('span', {className: "closeModal", textContent: 'Close'})
            this.header = DOMFactory('h2', {textContent: "Create a new project"});
            this.form = DOMFactory('form', {id: "projectForm"});
            this.inputProjectTitle = DOMFactory('input', {id: "inputProjectTitle", name: "inputProjectTitle", type: "text",
                                                          placeholder: "project title...", required: "true"});
            this.labelTitle = DOMFactory('label', {for: "inputProjectTitle", textContent: "Project Title (required):"})
            this.inputProjectDesc = DOMFactory('textarea', {id: "inputProjectDesc", name: "inputProjectDesc",
                                                            placeholder: "desc/notes..."});
            this.labelDesc = DOMFactory('label', {for: "inputProjectDesc", textContent: "Desc/Notes"})
            this.submitButton = DOMFactory('button', {id: "submitButtonProject", type: "submit", textContent: "Submit"});
        },
        appendElements: function() {        
            this.form.append(this.labelTitle, this.inputProjectTitle, this.labelDesc, this.inputProjectDesc, this.submitButton);
            formSection.append(this.closeButton, this.header, this.form);
        },
        bindEvents: function() {
            this.closeButton.addEventListener('click', this.closeModal.bind(formObject));
            this.form.addEventListener('submit', this.publishData.bind(formObject));
            this.form.addEventListener('submit', this.formFunction.bind(formObject))
        },
        closeModal: function() {
            formSection.remove()
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

export { initDisplayModule };
export { createTaskForm };