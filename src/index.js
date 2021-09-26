import './styles/style.css';
import pageLoadContent from "./modules/InitDisplay.js";
import { taskModule } from './modules/Task.js';
import { projectModule } from './modules/Project';
import getData from './modules/MainDisplay.js';

pageLoadContent();
taskModule.execute();
projectModule.execute();
getData();


