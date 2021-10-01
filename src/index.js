import './styles/normalize.css';
import './styles/reset.css';
import './styles/style.css';
import { initDisplayModule } from "./modules/InitDisplay.js";
import { todoModule } from './modules/Todo.js';
import { mainDisplayModule } from './modules/MainDisplay.js';

initDisplayModule.execute();
todoModule.execute();
mainDisplayModule.execute();