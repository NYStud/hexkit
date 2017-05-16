import EventEmitter from './EventEmitter';

export default class StatusBarPanel {

        constructor() {
            this.emitter = new EventEmitter();
            this._text = '';
        }

        set text(t) {
            this._text = t;
            this._emitOnTextChange(t);
        }

        get text() {
            return this._text;
        }

        _emitOnTextChange(text) {
            this.emitter.emit('textchange', text);
        }

        onTextChange(handler) {
            return this.emitter.on('textchange', handler);
        }
}
