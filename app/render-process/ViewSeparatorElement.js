import HTMLElement from './HTMLElement';

export default class ViewSeparatorElement extends HTMLElement {
    constructor() {
        super('div');
        this.addClass('view-separator-column');
    }
}
