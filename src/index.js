import './styles/style.css';
import pageLoadContent from "./modules/InitDisplay.js";
import { checkDuplicateTask, taskModule } from './modules/Task.js';
import { projectModule } from './modules/Project';
import getData from './modules/MainDisplay.js';

//import { checkDuplicateProject } from './modules/Project.js';

pageLoadContent();
//bindEvent();
taskModule.execute();
projectModule.execute();
getData();

//bindEventProject();
//checkDuplicateTask();
//checkDuplicateProject();

