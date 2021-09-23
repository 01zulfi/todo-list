import { ProjectItem } from "./FactoryFunctions";
import { pubsub } from "./Pubsub";


const projects = [];

function addProject() {
    const form = document.querySelector('#projectForm').elements;
    const newProject = ProjectItem(form['inputProjectTitle'].value, form['inputProjectDesc'].value, 
                                   form['inputProjectDueDate'].value);
    projects.push(newProject);
    pubsub.publish('addProject', projects);
}

function checkDuplicateProject() {
    document.querySelector('#inputProjectTitle').addEventListener('input', (e) => {
        let count = 0;  //to remove custom validation message when not required
        for (const project of projects) {
            if (e.target.value === project.title) {
                count++;
                e.target.setCustomValidity("Project with same name already exists");
            }
        }
        if (count === 0) {
            e.target.setCustomValidity("");
        } else {
            count = 0;  
        }
    })
}

function bindEventProject() {
    document.querySelector('#projectForm').addEventListener('submit', addProject);
}

export default bindEventProject;
export {checkDuplicateProject};
