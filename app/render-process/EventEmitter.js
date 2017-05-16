import Contracts from './Contracts';
import IDisposable from './IDisposable';
import EventSubscription from './EventSubscription';

export default class EventEmitter {

    constructor() {
        this.events = {};
        this.disposed = false;
    }

    on(ev, handler) {
        if(this.disposed) {
            return;
        }
        if(typeof this.events[ev] === 'undefined') {
            this.events[ev] = new Set();
        }
        this.events[ev].add(handler);
        return new EventSubscription(this, ev, handler);
    }

    emit(ev) {
        if(this.disposed) {
            return;
        }
        if(typeof this.events[ev] === 'undefined') {
            return;
        }
        let handlers = this.events[ev];
        for(let handler of handlers) {
            let args = (arguments.length === 1) ? [] : ((arguments.length === 2) ? [arguments[1]] : Array.apply(null, arguments).slice(1));
            handler.apply(this, args);
        }
    }

    remove(ev, handler) {
        if(this.disposed) {
            return;
        }
        if(typeof this.events[ev] !== 'undefined') {
            this.events[ev].delete(handler);
        }
    }

    dispose() {
        if(!this.disposed) {
            this.events = null;
            this.disposed = true;
        }
    }

}

Contracts.implement(EventEmitter, IDisposable);
