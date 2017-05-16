import EventEmitter from './EventEmitter';

export default class HexEditorRegistry {
    constructor() {
        this._editors = [];
        this._emitter = new EventEmitter();
        this._activeHexEditor = null;
    }

    add(hexEditor, activate = true, position = -1) {
        if((position < 0) || (position > this._editors.length)) {
            position = this._editors.length;
        }
        this._editors.splice(position, 0, hexEditor);
        hexEditor.add();
        this._emitter.emit('did-add', position, hexEditor);
        if((this._activeHexEditor === null) || (activate === true)) {
            this.activeHexEditor = hexEditor;
        }
    }

    remove(hexEditor) {
        let index = -1;
        for(let i = 0; i < this._editors.length; i++) {
            if(this._editors[i] === hexEditor) {
                index = i;
                break;
            }
        }
        if(index === -1) {
            return;
        }

        this._editors.splice(index, 1);
        hexEditor.remove();
        this._emitter.emit('did-remove', index, hexEditor);

        if(hexEditor === this.activeHexEditor) {
            if(this._editors.length === 0) {
                this.activeHexEditor = null;
            } else if(index >= this._editors.length) {
                this.activeHexEditor = this._editors[this._editors.length - 1];
            } else {
                this.activeHexEditor = this._editors[index];
            }
        }

    }

    get editors() {
        return this._editors;
    }

    get activeHexEditor() {
        return this._activeHexEditor;
    }

    set activeHexEditor(hexEditor) {
        if(this._activeHexEditor === hexEditor) {
            return;
        }
        if(this._activeHexEditor !== null) {
            this._activeHexEditor.activate(false);
        }
        this._emitter.emit('did-activate', hexEditor, false);
        this._activeHexEditor = hexEditor;
        if(this._activeHexEditor !== null) {
            this._activeHexEditor.activate(true);
        }
        this._emitter.emit('did-activate', hexEditor, true);
    }

    onDidAdd(handler) {
        return this._emitter.on('did-add', handler);
    }

    onDidRemove(handler) {
        return this._emitter.on('did-remove', handler);
    }

    onDidActivate(handler) {
        return this._emitter.on('did-activate', handler);
    }

    dispose() {
        this.emitter.dispose();
        this.emitter = null;
    }
}
