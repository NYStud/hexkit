export default class HexUtils {

    static byteToHexString(b) {
        if(b < 16) {
            return '0' + b.toString(16).toUpperCase();
        } else {
            return b.toString(16).toUpperCase();
        }
    }

    static lowerNibble(b) {
        return HexUtils.byteToHexString(b).charAt(1);
    }

    static higherNibble(b) {
        return HexUtils.byteToHexString(b).charAt(0);
    }

    static toHexString(num, digits = 8) {
        let hex = num.toString(16).toUpperCase();
        while(hex.length < digits) {
            hex = '0' + hex;
        }
        return hex;
    }

    static isHexChar(code) {
        if(code >= 48 && code < 58) {
            return true;
        }
        if(code >= 65 && code < 71) {
            return true;
        }
        if(code >= 97 && code < 103) {
            return true;
        }
        return false;
    }

    static charCodeToHexCode(code) {
        if(code >= 48 && code < 58) {
            return code - 48;
        }
        if(code >= 65 && code < 71) {
            return code - 65 + 10;
        }
        if(code >= 97 && code < 103) {
            return code - 97 + 10;
        }
        throw new TypeError('not a hex charecter');
    }
}
