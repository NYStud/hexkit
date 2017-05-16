import HTMLElement from './HTMLElement';

export default class StatusBarElement extends HTMLElement {

        constructor() {
            super('div');
            this.addClass('statusbar');
        }
}
