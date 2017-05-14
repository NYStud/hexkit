import Promise from 'bluebird';
import BinaryFile from './BinaryFile';
import fs from 'fs';

export default class NativeFile extends BinaryFile {

    constructor(path) {
        super();
        this.path = path;
        this.file = fs.openSync(path, 'r');
        const stats = fs.statSync(path);
        this.fileSizeInBytes = stats.size;
        this.disposed = false;
    }

    get size() {
        return this.fileSizeInBytes;
    }

    get canRead() {
        return true;
    }

    get canWrite() {
        return true;
    }

    read(offset, size) {
        return new Promise((resolve, reject) => {
            var buffer = new Buffer(size);
            fs.read(this.file, buffer, 0, size, offset, function(err, num, buffer) {
                if(err !== null) {
                    reject(err);
                } else {
                    resolve(buffer);
                }
            });
        });
    }

    dispose() {
        this.file = null;
        this.disposed = true;
    }
}
