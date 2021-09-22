import { ProjectItem } from "./FactoryFunctions";
import { pubsub } from "./Pubsub";


const projects = [];

function addProject() {
    const form = document.querySelector('#projectForm').elements;
    const newProject = ProjectItem(form['inputProjectTitle'].value, form['inputProjectDesc'].value, 
                                   form['inputProjectDueDate'].value);
    projects.push(newProject)
    pubsub.publish('addProject', projects)
}

function bindEventProject() {
    document.querySelector('#projectForm').addEventListener('submit', addProject);
}

export default bindEventProject;
