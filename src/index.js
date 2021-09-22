import './styles/style.css';
import pageLoadContent from "./modules/InitDisplay.js";
import bindEvent from './modules/Task.js';
import getData from './modules/MainDisplay.js';
import bindEventProject from './modules/Project.js';

pageLoadContent();
bindEvent();
getData();
bindEventProject();

