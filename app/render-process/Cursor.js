import EventEmitter from './EventEmitter';

export default class Cursor {

    constructor(offset = 0) {
        this.emitter = new EventEmitter();
        this.offset = offset;
        this.mode = 0;
    }

    getOffset() {
        return this.offset;
    }

    getMode() {
        return this.mode;
    }

    setCursor(offset, mode = -1) {
        this.offset = offset;
        if(mode !== -1) {
            this.mode = mode;
        }
        this.emitter.emit('cursorChange', this.offset, this.mode);
    }

    onCursorChange(handler) {
        return this.emitter.on('cursorChange', handler);
    }
}
