export default class TypedArrayUtils {

    static Uint8Array(size) {
        return new Uint8Array(size);
    }

    static Uint8ArrayResize(array, newSize) {
        let array2 = new Uint8Array(newSize);
        let length = array.length < array2.length ? array.length : array2.length;
        for(let i = 0; i < length; i++) {
            array2[i] = array[i];
        }
        return array2;
    }
}
