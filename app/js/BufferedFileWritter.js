import Promise from 'bluebird';

const BUFFER_LENGTH = 4096;

export default class BufferedFileWritter {
    constructor(file) {
        this.file = file;
        this.buffer = null;
        this.bufferOffset = -1;
        this.view = null;
    }

    flush() {
        if(this.bufferOffset === -1) {
            return;
        }
        file.write(this.view, 0, this.bufferOffset);
        this.bufferOffset = 0;
    }

    writeByte(byte) {
        if(this.bufferOffset === BUFFER_LENGTH) {
            this.flush();
        }
        if(this.bufferOffset === -1) {
            this.buffer = new ArrayBuffer(BUFFER_LENGTH);
            this.view = new Uint8Array(this.buffer);
            this.bufferOffset = 0;
        }
        this.view[this.bufferOffset++] = byte;
    }

    write(view, offset, length) {
        for(let i = 0; i < length; i++) {
            this.writeByte(view[offset + i]);
        }
    }
}
