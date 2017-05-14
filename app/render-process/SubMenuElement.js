import HTMLElement from './HTMLElement';

export default class MenuBarElement extends HTMLElement {
    constructor() {
        super('ul');
        this.addClass('submenu');
    }
}
