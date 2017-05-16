import HTMLTextElement from './HTMLTextElement';
import ClassBlinker from './ClassBlinker';

export default class HTMLCursorLetterElement extends HTMLTextElement {

    constructor(domElement) {
        super(domElement);
        this._cursor = false;
        this._blinker = new ClassBlinker({
            'element': this,
            'className': 'cursor',
            'enabled': false,
            'offDuration': 500,
            'onDuration': 500});
        this.disabled = true;
    }

    get disabled() {
        return this._disabled;
    }

    get dirty() {
        return this._dirty;
    }

    get selected() {
        return this._selected;
    }

    get hovered() {
        return this._hovered;
    }

    get focused() {
        return this._focused;
    }

    get new() {
        return this._new;
    }

    get cursor() {
        return this._blinker.enabled;
    }

    set disabled(disabled) {
        if(disabled !== this._disabled) {
            this._disabled = disabled;
            if(disabled) {
                this.addClass('disabled');
            } else {
                this.removeClass('disabled');
            }
        }
    }

    set dirty(dirty) {
        if(dirty !== this._dirty) {
            this._dirty = dirty;
            if(dirty) {
                this.addClass('dirty');
            } else {
                this.removeClass('dirty');
            }
        }
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

    set hovered(hovered) {
        if(hovered !== this._hovered) {
            this._hovered = hovered;
            if(hovered) {
                this.addClass('hover');
            } else {
                this.removeClass('hover');
            }
        }
    }

    set focused(focused) {
        if(focused !== this._focused) {
            this._focused = focused;
            if(focused) {
                this.addClass('focus');
            } else {
                this.removeClass('focus');
            }
        }
    }

    set new(_new) {
        if(_new !== this._new) {
            this._new = _new;
            if(_new) {
                this.addClass('new');
            } else {
                this.removeClass('new');
            }
        }
    }

    set cursor(cursor) {
        if(cursor === true) {
            this._blinker.enable();
        } else {
            this._blinker.disable();
        }
        this._blinker.enabled = cursor;
    }
}
