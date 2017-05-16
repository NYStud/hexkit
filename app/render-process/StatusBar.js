import EventEmitter from './EventEmitter';

export default class StatusBar {

        constructor() {
            this.emitter = new EventEmitter();
            this.panels = new Set();
        }

        addPanel(panel) {
            if(this.panels.has(panel)) {
                return;
            }
            this.panels.add(panel);
            this._emitOnAdd(panel);
        }

        removePanel(panel) {
            if(this.panels.delete(panel)) {
                this._emitOnDelete(panel);
            }
        }

        _emitOnAdd(panel) {
            this.emitter.emit('add', panel);
        }

        _emitOnDelete(panel) {
            this.emitter.emit('delete', panel);
        }

        onAdd(handler) {
            return this.emitter.on('add', handler);
        }

        onDelete(handler) {
            return this.emitter.on('delete', handler);
        }
}
