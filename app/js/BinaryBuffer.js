export default class BinaryBuffer {
    get size() {
        throw new Error('not implemented');
    }

    read(offset, size) {
        throw new Error('not implemented');
    }

    write(offset, size, data) {
    }

    onModify(handler) {
        throw new Error('not implemented');
    }

    onSize(handler) {
        throw new Error('not implemented');
    }
}
