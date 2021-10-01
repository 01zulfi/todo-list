import './styles/normalize.css';
import './styles/reset.css';
import './styles/style.css';
import pageLoadContent from "./modules/InitDisplay.js";
import { taskModule } from './modules/Todo.js';
import getData from './modules/MainDisplay.js';


pageLoadContent();
taskModule.execute();
getData();

console.log('run')
