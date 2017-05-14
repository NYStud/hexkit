import WebMenuBarElement from './WebMenuBarElement';

export default class WebMenuBarComponent {

    constructor(parentElement, menuBar) {
        this.menuBarElement = new WebMenuBarElement(menuBar).appendTo(parentElement);
    }
}
