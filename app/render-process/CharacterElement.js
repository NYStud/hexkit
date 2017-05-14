import HTMLCursorLetterElement from './HTMLCursorLetterElement';

export default class CharacterElement extends HTMLCursorLetterElement {
    constructor() {
        super('div');
        this.addClass('character-column');
    }
}
