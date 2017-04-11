import HTMLElement from './HTMLElement';
import EventTarget from './EventTarget';

export default class GroupSeparatorElement extends HTMLElement {
    constructor() {
        super('div');
        this.addClass('group-separator-column');
        this.on('mousedown', this._handleMouseDown.bind(this));
    }

    _handleMouseDown(e) {
        e = e || window.event;
        EventTarget.pauseEvent(e);
    }

    get selected() {
        return this._selected;
    }

    set selected(selected) {
        if(selected !== this._selected) {
            this._selected = selected;
            if(selected) {
                this.addClass('select');
            } else {
                this.removeClass('select');
            }
        }
    }
}
