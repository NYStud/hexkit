import FileReaderFactory from './FileReaderFactory';
import BinaryFile from './BinaryFile';
import Promise from 'bluebird';

const sliceFn = File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice;

export default class WebFile extends BinaryFile {

    constructor(file) {
        if(!(file instanceof File)) {
            throw new TypeError('not a File');
        }
        super();
        this.file = file;
        this.disposed = false;
    }

    get size() {
        return this.file.size;
    }

    get canRead() {
        return true;
    }

    get canWrite() {
        return false;
    }

    read(offset, size) {
        return new Promise((resolve, reject) => {
            let blob = sliceFn.call(this.file, offset, offset + size, this.file.type);
            let reader = FileReaderFactory.create();
            let release = function() {
                blob = null;
                reader.onloadend = null;
                reader.onerror = null;
                FileReaderFactory.release(reader);
            };
            reader.onloadend = function() {
                resolve(reader.result);
                release();
            };
            reader.onerror = function() {
                reject();
                release();
            };
            reader.readAsArrayBuffer(blob);
        });
    }

    dispose() {
        this.file = null;
        this.disposed = true;
    }
}
