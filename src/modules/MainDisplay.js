import DOMFactory from "./FactoryFunctions.js";
import { createTaskForm } from "./InitDisplay.js";
import { pubsub } from "./Pubsub.js";

function getData() {
    pubsub.subscribe('addTask', log);
    pubsub.subscribe('addProject', log)
    pubsub.subscribe('addProject', displayProjects)
}

function log(data) {
    console.log(data);
}

function displayProjects(projects) {  
    projects = projects.filter(project => { 
        if (document.getElementById(`${project.filteredTitle}`)) return false
        return true
    })
    for (const project of projects) {
        const projectName = DOMFactory('h3', {id: `${project.filteredTitle}`, className: "projectName",
                                              textContent: `${project.title}`});
        const addTaskInProjectButton = DOMFactory('button', {id: `${project.filteredTitle} button`,
                                                             textContent: `Add Task in ${project.title}`})
        const taskInProjectForm = createTaskForm(`TaskIn${project.filteredTitle}`);
        taskInProjectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            pubsub.publish('addTaskInProject', taskInProjectForm)
            e.target.reset();
            
        })
        addTaskInProjectButton.addEventListener('click', () => {
            taskInProjectForm.style.display = "block";
        })       
                                       
        document.body.append(projectName, addTaskInProjectButton);
        document.body.append(taskInProjectForm);
        document.getElementById(`addTaskIn${project.filteredTitle}ChecklistButton`).addEventListener('click', () => {
            document.querySelector(`#inputTaskIn${project.filteredTitle}Checklist`).style.display = "block";
            document.querySelector(`#submitTaskIn${project.filteredTitle}ChecklistButton`).style.display = "block";
        })
        document.getElementById(`submitTaskIn${project.filteredTitle}ChecklistButton`).addEventListener('click', () => {
            document.querySelector(`#inputTaskIn${project.filteredTitle}Checklist`).style.display = "none";
            document.querySelector(`#submitTaskIn${project.filteredTitle}ChecklistButton`).style.display = "none";
            pubsub.publish('addChecklistInTaskInProject',
                            document.querySelector(`#inputTaskIn${project.filteredTitle}Checklist`).value);
            document.querySelector(`#inputTaskIn${project.filteredTitle}Checklist`).value = '';
        })
    }
}




export default getData;