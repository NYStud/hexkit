import EventEmitter from './EventEmitter';

export default class Selection {

    constructor(start = -1, end = -1) {
        this.emitter = new EventEmitter();
        this.start = start;
        this.end = end;
    }

    setSelection(start, end) {
        this.start = start;
        this.end = end;
        this.emitter.emit('selectionchange', start, end);
    }

    onSelectionChange(handler) {
        return this.emitter.on('selectionchange', handler);
    }
}
