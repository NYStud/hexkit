export default class BinaryFile {
    constructor() {
    }

    get canRead() {
        throw new Error('not implemented');
    }

    get canWrite() {
        throw new Error('not implemented');
    }

    read() {
        throw new Error('not implemented');
    }

    write() {
        throw new Error('not implemented');
    }

    get size() {
        throw new Error('not implemented');
    }

    dispose() {

    }
}
