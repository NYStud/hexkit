import Contracts from './Contracts';
import IDisposable from './IDisposable';

class DOMEventSubscription {

    constructor(domElement, ev, handler, useCapture = false) {
        this.domElement = domElement;
        this.ev = ev;
        this.handler = handler;
        this.useCapture = useCapture;
        this.disposed = false;
    }

    dispose() {
        if(!this.disposed) {
            this.domElement.removeEventListener(this.ev, this.handler, this.useCapture);
            this.disposed = true;
        }
    }
}

Contracts.implement(DOMEventSubscription, IDisposable);

export default class EventTarget {
    constructor(target) {
        this.target = target;
    }

    on(ev, handler, useCapture = false) {
        this.target.addEventListener(ev, handler, useCapture);
        return new DOMEventSubscription(this.target, ev, handler, useCapture);
    }

    static pauseEvent(e) {
        if(e.stopPropagation) {
            e.stopPropagation();
        }
        if(e.preventDefault) {
            e.preventDefault();
        }
        e.cancelBubble=true;
        e.returnValue=false;
        return false;
    }
}
