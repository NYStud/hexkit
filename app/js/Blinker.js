import HTMLElement from './HTMLElement';

export default class Blinker {

    constructor(el, cls, enabled = false, onDuration = 500, offDuration = 500) {
        if(!(el instanceof HTMLElement)) {
            throw new TypeError('not a HTMLElement');
        }
        this.element = el;
        this.class = cls;
        this.onDuration = onDuration;
        this.offDuration = offDuration;
        this.enabled = enabled;
        this.timeout = null;
    }

    _on() {
        if(this.enabled === false) {
            return;
        }
        this.element.addClass(this.class);
        this.timeout = setTimeout(this._off.bind(this), this.onDuration);
    }

    _off() {
        this.element.removeClass(this.class);
        if(this.enabled === true) {
            setTimeout(this._on.bind(this), this.offDuration);
        }
    }

    get enabled() {
        return this._enabled;
    }

    set enabled(enabled) {
        if(enabled !== this._enabled) {
            this._enabled = enabled;
            if(enabled) {
                this._on();
            } else {
                if(this.timeout !== null) {
                    clearTimeout(this.timeout);
                }
                this._off();
            }
        }
    }
}
