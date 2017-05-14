import EventTarget from './EventTarget';

export default class HTMLElement {

    constructor(domElement) {
        if(typeof domElement === 'string') {
            this._domElement = HTMLElement.createDOMElement(domElement);
        } else if(domElement instanceof Node) {
            this._domElement = domElement;
        } else if(domElement instanceof HTMLElement) {
            this._domElement = domElement.element;
        } else {
            throw 'Invalid domElement';
        }

        this._eventTarget = new EventTarget(this._domElement);
        this._parent = null;
    }

    get element() {
        return this._domElement;
    }

    on(ev, handler, useCapture = false) {
        return this._eventTarget.on(ev, handler, useCapture);
    }

    set className(className) {
        this._domElement.className = className;
    }

    get className() {
        return this._domElement.className;
    }

    hasClass(className) {
        if (this._domElement.classList) {
            return this._domElement.classList.contains(className);
        } else {
            return !!this._domElement.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
        }
    }

    addClass(className) {
        if(className === '') {
            return;
        }
        if (this._domElement.classList) {
            this._domElement.classList.add(className);
        } else if (!this.hasClass(className)) {
            this._domElement.className += ' ' + className;
        }
        return this;
    }

    removeClass(className) {
        if(className === '') {
            return;
        }
        if (this._domElement.classList) {
            this._domElement.classList.remove(className);
        } else if (this.hasClass(className)) {
            let reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
            this._domElement.className = this._domElement.className.replace(reg, ' ');
        }
        return this;
    }

    getStyle (prop) {
        if (window.getComputedStyle !== 'undefined') {
            return window.getComputedStyle(this._domElement, null).getPropertyValue(prop);
        } else {
            return this._domElement.currentStyle[prop];
        }
    }

    get offsetTop() {
        return this._domElement.offsetTop;
    }

    get offsetLeft() {
        return this._domElement.offsetLeft;
    }

    get offsetHeight() {
        return this._domElement.getBoundingClientRect().height;
    }

    get offsetWidth() {
        return this._domElement.getBoundingClientRect().width;
    }

    get clientWidth() {
        return this._domElement.clientWidth;
    }

    get clientHeight() {
        return this._domElement.clientHeight;
    }

    show() {
        this.hidden = false;
        return this;
    }

    hide() {
        this.hidden = true;
        return this;
    }

    disable() {
        this.disabled = true;
        return this;
    }

    enable() {
        this.disabled = false;
        return this;
    }

    activate() {
        this.active = true;
        return this;
    }

    deactivate() {
        this.active = false;
        return this;
    }

    get hidden() {
        return typeof this._hidden === 'undefined' ? false : this._hidden;
    }

    set hidden(hidden) {
        if(this._hidden !== hidden) {
            this._hidden = hidden;
            if(hidden) {
                this.addClass('hide');
            } else {
                this.removeClass('hide');
            }
        }
    }

    get disabled() {
        return typeof this._disabled === 'undefined' ? false : this._disabled;
    }


    set disabled(disable) {
        if(this._disabled !== disable) {
            this._disabled = disable;
            if(disable) {
                this.addClass('disabled');
            } else {
                this.removeClass('disabled');
            }
        }
    }

    get active() {
        return typeof this._active === 'undefined' ? false : this._active;
    }


    set active(active) {
        if(this._active !== active) {
            this._active = active;
            if(active) {
                this.addClass('active');
            } else {
                this.removeClass('active');
            }
        }
    }

    get topPadding() {
        return parseFloat(this.getStyle('padding-top').replace('px', ''), 10);
    }

    get bottomPadding() {
        return parseFloat(this.getStyle('padding-bottom').replace('px', ''), 10);
    }

    get leftPadding() {
        return parseFloat(this.getStyle('padding-left').replace('px', ''), 10);
    }

    get rightPadding() {
        return parseFloat(this.getStyle('padding-right').replace('px', ''), 10);
    }

    get topBorderWidth() {
        return parseFloat(this.getStyle('border-top-width').replace('px', ''), 10);
    }

    get bottomBorderWidth() {
        return parseFloat(this.getStyle('border-bottom-width').replace('px', ''), 10);
    }

    get leftBorderWidth() {
        return parseFloat(this.getStyle('border-left-width').replace('px', ''), 10);
    }

    get rightBorderWidth() {
        return parseFloat(this.getStyle('border-right-width').replace('px', ''), 10);
    }

    set position(pos) {
        this._domElement.style.position = pos;
    }

    get position() {
      return this.getStyle('position');
    }

    set top(px) {
        this._domElement.style.top = px;
    }

    get top() {
        return this.getStyle('top');
    }

    set bottom(px) {
        this._domElement.style.bottom = px;
    }

    get bottom() {
        return this.getStyle('bottom');
    }

    set left(px) {
        this._domElement.style.left = px;
    }

    get left() {
        return this.getStyle('left');
    }

    set width(px) {
        this._domElement.style.width = px;
    }

    get width() {
        return this.getStyle('width');
    }

    set height(px) {
        this._domElement.style.height = px;
    }

    get height() {
        return this.getStyle('height');
    }

    get parent() {
        return this._parent;
    }

    append(htmlElement) {
        if(htmlElement instanceof HTMLElement) {
            this._domElement.appendChild(htmlElement._domElement);
            htmlElement._parent = this;
        } else {
            throw new TypeError('not a HTMLElement');
        }
        return this;
    }

    insertBefore(htmlElement) {
        if(htmlElement instanceof HTMLElement) {
            htmlElement.parent._domElement.insertBefore(this._domElement, htmlElement._domElement);
            this._parent = htmlElement.parent;
        } else {
            throw new TypeError('not a HTMLElement');
        }
        return this;
    }

    appendTo(htmlElement) {
        if(htmlElement instanceof HTMLElement) {
            htmlElement.append(this);
        } else {
            throw new TypeError('not a HTMLElement');
        }
        return this;
    }

    remove() {
        if(this._domElement.parentNode !== null) {
            this._domElement.parentNode.removeChild(this._domElement);
        }
        this._parent = null;
        return this;
    }

    dispose() {
        this.eventTarget.dispose();
        this._parent = null;
    }

    static createDOMElement(tag) {
        return document.createElement(tag);
    }

    static createDOMTextNode(text) {
        return document.createTextNode(text);
    }
}
