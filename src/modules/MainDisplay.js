import { pubsub } from "./Pubsub.js";

pubsub.subscribe('addTask', log);
function log(tasks) {
    if (tasks === undefined) return
    console.log(tasks)
}

export default log;