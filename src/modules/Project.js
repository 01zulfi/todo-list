function addProject() {
    const project = {title: 'New Project'};
    document.body.append(JSON.stringify(project));
}

function bindEventProject() {
    document.querySelectorAll('button')[1].addEventListener('click', addProject);
}

export default bindEventProject;
