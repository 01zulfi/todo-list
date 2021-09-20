const DOMFactory = function(element, attributes) {
    const newElement = document.createElement(element);
    for (const attribute in attributes) {
        newElement[attribute] = attributes[attribute];
    }
    return newElement
}

const Title = function(title) {
    return {title}
}

const Description = function(description) {
    return {description}
}

const DueDate = function(dueDate) {
    return {dueDate}
}

const Priority = function(priority) {
    return {priority}
}


export {Title, Description, DueDate, Priority};
export default DOMFactory;