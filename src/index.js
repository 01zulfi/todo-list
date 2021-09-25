import './styles/style.css';
import pageLoadContent from "./modules/InitDisplay.js";
import { checkDuplicateTask, taskModule } from './modules/Task.js';
import getData from './modules/MainDisplay.js';
import { checkDuplicateProject } from './modules/Project.js';

pageLoadContent();
//bindEvent();
taskModule.execute();
getData();

//bindEventProject();
//checkDuplicateTask();
checkDuplicateProject();

