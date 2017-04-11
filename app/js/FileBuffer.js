import EventEmitter from './EventEmitter';
import BinaryBuffer from './BinaryBuffer';

export default class FileBuffer extends BinaryBuffer {

    constructor(file) {
        this.emitter = new EventEmitter();
        this._file = file;
        this._size = this._fileReader.size;
    }

    get size() {
        return this._size;
    }

    read(offset, size) {
        return this._file.read(offset, size);
    }

    write(offset, size, data) {
    }

    _emitModfy(offset, length) {
        this.emitter.emit('modify', offset, length);
    }

    _emitSize(length) {
        this.emitter.emit('size', length);
    }

    onModify(handler) {
        return this.emitter.on('modify', handler);
    }

    onSize(handler) {
        return this.emitter.on('size', handler);
    }
}
