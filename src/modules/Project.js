import { ProjectItem } from "./FactoryFunctions";
import { pubsub } from "./Pubsub";
import { TaskItem } from "./FactoryFunctions";


const projects = [];

function addProject() {
    const form = document.querySelector('#projectForm').elements;
    const newProject = ProjectItem(form['inputProjectTitle'].value, form['inputProjectDesc'].value, 
                                   form['inputProjectDueDate'].value);
    newProject.tasks = [];
    projects.push(newProject);
    pubsub.publish('addProject', projects);
}

pubsub.subscribe('addTaskInProject', addTaskInProject);
function addTaskInProject(form) {
    const data = form.firstChild.elements;
    const newTask = TaskItem(data[0].value, data[1].value, data[2].value, data[3].value);
    for (const project of projects) {
        if (form.className.includes(project.filteredTitle)) {
            project.tasks.push(newTask);
        }
    }
    console.log(projects)
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
