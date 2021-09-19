const initDisplayObject = {
    init: function() {
        this.createElements();
        this.setContent();
        this.appendContent();
    },
    createElements: function() {
        this.title = document.createElement('h1');
        this.task = document.createElement('h2');
        this.taskAddButton = document.createElement('button');
        this.project = document.createElement('h3');
        this.projectAddButton = document.createElement('button');
    },
    setContent: function() {
        this.title.textContent = 'T O D O';
        this.task.textContent = 'Task';
        this.taskAddButton.textContent = 'Add Task';
        this.project.textContent = 'Project';
        this.projectAddButton.textContent = 'Add Project'
    },
    appendContent: function() {
        document.body.append(this.title);
        document.body.append(this.task);
        document.body.append(this.taskAddButton);
        document.body.append(this.project);
        document.body.append(this.projectAddButton);
    },
};

const pageLoadContent = () => initDisplayObject.init();

export default pageLoadContent;