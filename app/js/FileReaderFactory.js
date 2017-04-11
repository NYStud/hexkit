
const cache = [];

export default class FileReaderFactory {

    static create() {
        if(cache.length !== 0) {
            return cache.pop();
        }
        return new FileReader();
    }

    static release(reader) {
        if(reader instanceof FileReader) {
            cache.push(reader);
        } else {
            throw new TypeError('not a FileReader');
        }
    }

    static collect() {
        while(cache.pop() !== undefined) {}
    }
}
