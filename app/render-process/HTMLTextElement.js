import HTMLElement from './HTMLElement';

export default class HTMLTextElement extends HTMLElement {

    constructor(domElement) {
        super(domElement);
        let textNode = HTMLElement.createDOMTextNode('');
        this.textNode = textNode;
        this.element.appendChild(textNode);
    }

    set text(text) {
        this.textNode.nodeValue = text;
    }

    get text() {
        return this.textNode.nodeValue;
    }
}
