import DOMFactory from "./FactoryFunctions.js";
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
        if (document.getElementById(`${project.title}`)) return false
        return true
    })
    for (const project of projects) {
        const projectName = DOMFactory('h3', {id: `${project.title}`, className: "projectName",
                                              textContent: `${project.title}`});
        const addTaskInProjectButton = DOMFactory('button', {id: `${project.title} button`, 
                                                             textContent: "Add Task in Project"});
        document.body.append(projectName, addTaskInProjectButton);
    }
}

export default getData;