import MenuBarElement from './MenuBarElement';

export default class MenuBarComponent {

    constructor(parentElement, menuBar) {
        this.menuBarElement = new MenuBarElement(menuBar).appendTo(parentElement);
    }
}
