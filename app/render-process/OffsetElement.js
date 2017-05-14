import HTMLTextElement from './HTMLTextElement';
import EventTarget from './EventTarget';

export default class OffsetElement extends HTMLTextElement {
    constructor() {
        super('div');
        this.addClass('offset-column');
        this.on('mousedown', this._handleMouseDown.bind(this));
    }

    _handleMouseDown(e) {
        e = e || window.event;
        EventTarget.pauseEvent(e);
    }
}
