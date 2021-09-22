import { pubsub } from "./Pubsub.js";

function getData() {
    pubsub.subscribe('addTask', log);
}

function log(tasks) {
    console.log(tasks);
}

export default getData;