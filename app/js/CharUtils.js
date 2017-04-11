let ansiChars =
    [
        8364, 46,   8218, 402,  8222, 8230, 8224, 8225,
        710,  8240, 352,  8249, 338,  46,   381,  46,
        46,   8216, 8217, 8220, 8221, 8226, 8211, 8212,
        732,  8482, 353,  8250, 339,  46,   382,  376
    ];

export default class CharUtils {

    static byteToChar(b) {
        if(b < 0) {
            return '.';
        } else if(b < 32) {
            return '.';
        } else if(b < 127) {
            return String.fromCharCode(b);
        } else if(b === 127) {
            return ' ';
        } else if(b < 160) {
            return String.fromCharCode(ansiChars[b - 128]);
        } else {
            return String.fromCharCode(b);
        }
    }
}
