import Contracts from './Contracts';
import IDisposable from './IDisposable';

export default class EventSubscription {

    constructor(emitter, ev, handler) {
        this.emitter = emitter;
        this.ev = ev;
        this.handler = handler;
        this.disposed = false;
    }

    dispose() {
        if(!this.disposed) {
            this.emitter.remove(this.ev, this.handler);
            this.disposed = true;
        }
    }
}

Contracts.implement(EventSubscription, IDisposable);
