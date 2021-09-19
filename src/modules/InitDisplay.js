const initDisplayObject = {
    init: function() {
        this.createElements();
        this.setContent();
        this.appendContent();
    },
    createElements: function() {
        this.title = document.createElement('h1');
        this.task = document.createElement('p');
        this.taskAddButton = document.createElement('button');
    },
    setContent: function() {
        this.title.textContent = 'T O D O';
        this.task.textContent = 'Task';
        this.taskAddButton.textContent = 'Add Task';
    },
    appendContent: function() {
        document.body.append(this.title);
        document.body.append(this.task);
        document.body.append(this.taskAddButton);
    },
};

const pageLoadContent = () => initDisplayObject.init();


export {pageLoadContent};