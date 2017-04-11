import EventTarget from './EventTarget';

class Accelerator {
    constructor(alt, ctrl, shift, meta, key, handler) {
        this.alt = alt;
        this.ctrl = ctrl;
        this.shift = shift;
        this.meta = meta;
        this.key = key;
        this.handler = handler;
    }

    matches(event) {
        if((event.altKey === this.alt)
        && (event.ctrlKey === this.ctrl)
        && (event.shiftKey === this.shift)
        && (event.metaKey === this.meta)
        && (event.key.toLowerCase() === this.key.toLowerCase())) {
            return true;
        }
        return false;
    }

    call() {
        this.handler();
    }
}

export default class WebShortcuts {
    constructor() {
        this.accels = [];
        this.listen();
        this.register('alt+r', function() {
            alert('hello');
        });
    }

    register(key, handler) {
        this.accels.push(this.makeAccelerator(key, handler));
    }

    unregister(key) {
        //this.keys[key] = null;
    }

    unregisterAll() {
        this.accels = [];
    }

    makeAccelerator(str, handler) {
        let tokens = str.split('+');
        let alt = false;
        let ctrl = false;
        let shift = false;
        let meta = false;
        let key = '';
        for(let i = 0; i < tokens.length; i++) {
            switch(tokens[i].toLowerCase()) {
                case 'ctrl':
                case 'control':
                    ctrl = true;
                    break;
                case 'cmd':
                case 'command':
                    meta = true;
                    break;
                case 'shift':
                    shift = true;
                    break;
                case 'alt':
                case 'altgr':
                case 'option':
                    alt = true;
                    break;
                default:
                    key = tokens[i];
                    break;
            }
        }
        return new Accelerator(alt, ctrl, shift, meta, key, handler);
    }

    _handleKeyPress(e) {
        e = e || window.event;
        for(let i = 0; i < this.accels.length; i++) {
            if(this.accels[i].matches(e)) {
                this.accels[i].call();
            }
        }
    }

    listen() {
        let documentEventTarget = new EventTarget(document);
        documentEventTarget.on('keypress', this._handleKeyPress.bind(this));
    }

}
