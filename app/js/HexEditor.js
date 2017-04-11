import Selection from './Selection';
import Cursor from './Cursor';
import EventEmitter from './EventEmitter';

export default class HexEditor {

    constructor(byteBuffer) {
        this.emitter = new EventEmitter();

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

    onOffsetChange(handler) {
        return this.emitter.on('offsetchange', handler);
    }

    dispose() {
        this.emitter.dispose();
    }
}
