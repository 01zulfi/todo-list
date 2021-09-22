import { pubsub } from "./Pubsub.js";

function getData() {
    pubsub.subscribe('addTask', log);
    pubsub.subscribe('addProject', log)
}

function log(data) {
    console.log(data);
}

export default getData;