import HTMLElement from './HTMLElement';

export default class TitleBarElement extends HTMLElement {
    constructor() {
        super('div');
        this.addClass('title-bar');
    }
}
