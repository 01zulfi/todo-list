import './styles/style.css';
import pageLoadContent from "./modules/InitDisplay.js";
import { checkDuplicateTask } from './modules/Task.js';
import getData from './modules/MainDisplay.js';
import bindEventProject, { checkDuplicateProject } from './modules/Project.js';

pageLoadContent();
//bindEvent();
getData();
bindEventProject();
checkDuplicateTask();
checkDuplicateProject();

