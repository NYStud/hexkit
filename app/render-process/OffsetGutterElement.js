import HTMLElement from './HTMLElement';
import EventTarget from './EventTarget';

export default class OffsetGutterElement extends HTMLElement {
    constructor() {
        super('div');
        this.addClass('offset-gutter-column');
        this.on('mousedown', this._handleMouseDown.bind(this));
    }

    _handleMouseDown(e) {
        e = e || window.event;
        EventTarget.pauseEvent(e);
    }
}
