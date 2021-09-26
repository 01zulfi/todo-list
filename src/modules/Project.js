import { pubsub } from "./Pubsub";
import { TaskItem, TaskManager, ProjectManager } from "./FactoryFunctions";


const projectModule = {
    execute: function() {
        pubsub.subscribe('addProject', createProject);
        pubsub.subscribe('addTaskInProject', addTaskInProject);
        //checkDuplicateProject();
    }
}

const allProjects = ProjectManager();

function createProject(form) {
    console.log(form)
    const project = TaskManager(form['inputProjectTitle'].value, form['inputProjectDesc'].value, 
                                   form['inputProjectDueDate'].value);
    allProjects.add(project);
    pubsub.publish('addProjectDOM', allProjects.projectArray);
    console.log(allProjects.projectArray);
}


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

export {projectModule};
