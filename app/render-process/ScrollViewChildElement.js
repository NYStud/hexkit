import HTMLElement from './HTMLElement';

export default class ScrollViewChildElement extends HTMLElement {

    constructor(domElement, viewHeight = 0, viewWidth = 0) {
        super(domElement);
        this.viewHeight = viewHeight;
        this.viewWidth = viewWidth;
    }

    get viewHeight() {
        return this._viewHeight;
    }

    set viewHeight(viewHeight) {
        this._viewHeight = viewHeight;
    }

    get viewWidth() {
        return this._viewWidth;
    }

    set viewWidth(viewWidth) {
        this._viewWidth = viewWidth;
    }
}
