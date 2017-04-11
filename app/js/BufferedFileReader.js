import Promise from 'bluebird';

const BUFFER_LENGTH = 4096;

export default class BufferedFileReader {
    constructor(file) {
        this.file = file;
        this.buffer = null;
        this.bufferOffset = -1;
        this.view = null;
    }

    readByte(offset) {
        let bufferOffset = offset - (offset % BUFFER_LENGTH);
        let self = this;
        return new Promise((resolve, reject) => {
            if(self.bufferOffset != bufferOffset) {
                let bufferLength = BUFFER_LENGTH;
                if(bufferOffset + bufferLength > self.file.size) {
                    bufferLength = self.file.size - bufferOffset;
                }
                self.file.read(bufferOffset, bufferLength).then(function(buffer) {
                    self.buffer = buffer;
                    self.view = new Uint8Array(buffer);
                    resolve(self.view[offset - bufferOffset]);
                })
            } else {
                resolve(self.view[offset - bufferOffset]);
            }
        });
    }
}
