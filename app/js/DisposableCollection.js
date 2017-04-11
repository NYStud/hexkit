import Contracts from './Contracts';
import IDisposable from './IDisposable';

export default class DisposableCollection {

    constructor() {
        this.disposables = new Set();
        this.disposed = false;
    }

    add(disposable) {
        if(IDisposable.isImplementedBy(disposable)) {
            this.disposables.add(disposable);
        } else {
            throw new TypeError('add method requires a IDisposable');
        }
    }

    dispose() {
        if(!this.disposed) {
            for(let disposable of this.disposables) {
                disposable.dispose();
            }
            this.disposed = true;
        }
    }
}

Contracts.implement(DisposableCollection, IDisposable);
