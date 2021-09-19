import './styles/style.css';
import pageLoadContent from "./modules/InitDisplay";
import bindEventTask from "./modules/Task.js";
import bindEventProject from "./modules/Project";

pageLoadContent();
bindEventTask();
bindEventProject();