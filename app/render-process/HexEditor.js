import Selection from './Selection';
import Cursor from './Cursor';
import EventEmitter from './EventEmitter';

export default class HexEditor {

    constructor(byteBuffer, path = '') {
        this.emitter = new EventEmitter();

        this.path = path;
        this.cursor = new Cursor();
        this.selection = new Selection();
        this.byteBuffer = byteBuffer;
        this._offset = 0;
    }

    get offset() {
        return this._offset;
    }

    set offset(val) {
        if(val > this.byteBuffer.size) {
            throw new RangeError('offset out of range');
        }
        if(this._offset !== val) {
            this._offset = val;
            this.emitter.emit('offsetchange', val);
        }
    }

    get active() {
        return this._active;
    }

    set active(act) {
        if(act === this._active) {
            return;
        }
        this._active = act;
        this.emitter.emit('change-active', act);
    }

    close() {
        this.emitter.emit('close', this);
    }

    onClose(handler) {
        return this.emitter.on('close', handler);
    }

    onOffsetChange(handler) {
        return this.emitter.on('offsetchange', handler);
    }

    onChangeActive(handler) {
        this.emitter.on('change-active', handler);
    }

    dispose() {
        this.emitter.dispose();
    }
}
