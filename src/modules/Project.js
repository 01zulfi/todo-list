function addProject() {
    const project = {title: 'New Project'};
    document.body.append(JSON.stringify(project));
}

function bindEventProject() {
    document.querySelector('.addProjectButton').addEventListener('click', addProject);
}

export default bindEventProject;
