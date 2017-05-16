import EventEmitter from './EventEmitter';

export default class Tab {
    constructor(tabBar, caption) {
        this._emitter = new EventEmitter();
        this._caption = caption;
        this._tabBar = tabBar;
    }

    get caption() {
        return this._caption;
    }

    set caption(val) {
        if(this._caption !== val) {
            this._caption = val;
            this._emitter.emit('did-change-caption', val);
        }
    }

    get isActive() {
        return (this._tabBar.activeTab === this);
    }

    activate() {
        this._tabBar.activeTab = this;
    }

    close() {
        this._emitter.emit('close');
    }

    onClose(handler) {
        return this._emitter.on('close', handler);
    }

    onDidChangeCaption(handler) {
        return this._emitter.on('did-change-caption', handler);
    }

    dispose() {
        this._emitter.dispose();
    }
}
