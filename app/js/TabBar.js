import EventEmitter from './EventEmitter';

export default class TabBar {

    constructor() {
        this._tabs = [];
        this._activeTab = null;
        this._emitter = new EventEmitter();
    }

    get tabs() {
        return this._tabs;
    }

    get activeTab() {
        return this._activeTab;
    }

    set activeTab(tab) {
        if(tab === this._activeTab) {
            return;
        }
        for(let i = 0; i < this.tabs.length; i++) {
            if(this.tabs[i] === tab) {
                this._activeTab = tab;
                this._emitter.emit('did-change-active', tab, i);
                break;
            }
        }
    }

    addTab(tab, activate = true, position = -1) {
        if(position < 0 || position > this.tabs.length) {
            position = this.tabs.length;
        }
        this.tabs.splice(position, 0, tab);
        this._emitter.emit('did-add-tab', tab, position);
        if(activate === true) {
            this.activeTab = tab;
        }
    }

    removeTab(tab) {
        let index = -1;
        for(let i = 0; i < this.tabs.length; i++) {
            if(this.tabs[i] === tab) {
                index = i;
                break;
            }
        }
        if(index === -1) {
            throw new Error('tab not found');
        }
        if(this._activeTab === tab) {
            if(index < this.tabs.length - 1) {
                this.activeTab = this.tabs[index + 1];
            } else if(index > 0) {
                this.activeTab = this.tabs[index - 1];
            } else {
                this.activeTab = null;
            }
        }
        this.tabs.splice(index, 1);
        this._emitter.emit('did-remove-tab', tab, index);
    }

    onDidChangeActive(handler) {
        return this._emitter.on('did-change-active', handler);
    }

    onDidAddTab(handler) {
        return this._emitter.on('did-add-tab', handler);
    }

    onDidRemoveTab(handler) {
        return this._emitter.on('did-remove-tab', handler);
    }

    dispose() {
        this._emitter.dispose();
    }
}
