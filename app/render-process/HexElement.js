import HTMLCursorLetterElement from './HTMLCursorLetterElement';

export default class HexElement extends HTMLCursorLetterElement {
    constructor() {
        super('div');
        this.addClass('hex-column');
    }
}
