import { ProjectItem } from "./FactoryFunctions";
import { pubsub } from "./Pubsub";
import { TaskItem } from "./FactoryFunctions";

const projects = [];

pubsub.subscribe('addProject', createProject)
function createProject(form) {
    const project = ProjectItem(form['inputProjectTitle'].value, form['inputProjectDesc'].value, 
                                   form['inputProjectDueDate'].value);
    projects.push(project);
    pubsub.publish('addProjectDOM', projects);
}

pubsub.subscribe('addTaskInProject', addTaskInProject);
function addTaskInProject(form) {
    const task = TaskItem(form["inputTaskName"].value, form["inputTaskDesc"].value, form["inputTaskDueDate"].value,
                             form["inputTaskPriority"].value, document.querySelectorAll('.inputChecklist'));
    for (const project of projects) {
        if (form[0].parentNode.id.includes(project.filteredTitle)) {
            project.tasks.push(task);
            break;
        }
    }
    pubsub.publish('addTaskInProjectDOM', projects);
    console.dir(projects);
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

export {checkDuplicateProject};
