import { ProjectItem } from "./FactoryFunctions";
import { pubsub } from "./Pubsub";
import { TaskItem } from "./FactoryFunctions";


const projects = [];
const checklist = [];

pubsub.subscribe('addProject', createProject)
function createProject(form) {
    const newProject = ProjectItem(form['inputProjectTitle'].value, form['inputProjectDesc'].value, 
                                   form['inputProjectDueDate'].value);
    projects.push(newProject);
    pubsub.publish('addProjectDOM', projects);
}
pubsub.subscribe('addChecklistInTaskInProject', addChecklistInTaskInProject);
function addChecklistInTaskInProject(item) {
    if (!item) return
    const itemObj = {
        content: item,
        checked: false,
    }
    checklist.push(itemObj);
}

pubsub.subscribe('addTaskInProject', addTaskInProject);
function addTaskInProject(form) {
    const data = form.firstChild.elements;
    const newTask = TaskItem(data[0].value, data[1].value, data[2].value, data[3].value);
    newTask.checklist = [];
    newTask.checklist = checklist.slice();
    for (const project of projects) {
        if (form.className.includes(project.filteredTitle)) {
            project.tasks.push(newTask);
        }
    }
    console.log(projects)
    checklist.splice(0);
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
