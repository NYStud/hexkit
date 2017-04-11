import EventEmitter from './EventEmitter';

export default class Workspace {
    constructor() {
        this._activeHexEditor = null;
        this._hexEditors = [];
        this._emitter = new EventEmitter();
    }

    get activeHexEditor() {
        return this._activeHexEditor;
    }

    set activeHexEditor(hexEditor) {
        let index = -1;
        for(let i = 0; i < this._hexEditors.length; i++) {
            if(this._hexEditors[i] === hexEditor) {
                index = i;
                break;
            }
        }
        if(index === -1) {
            throw new Error('HexEditor not found');
        }
        this._activeHexEditor = hexEditor;
        this._emitter.emit('did-change-active-hexeditor', hexEditor);
    }

    get hexEditors() {
        return this._hexEditors;
    }

    addHexEditor(hexEditor, position = -1) {
        if(position >= 0 && position < this._hexEditors.length) {
            this._hexEditors.splice(position, 0, hexEditor);
        } else {
            this._hexEditors.push(position);
        }
        this._emitter.on('did-add-hexeditor', hexEditor, position);
    }

    removeHexEditor(hexEditor) {
        let index = -1;
        for(let i = 0; i < this._hexEditors.length; i++) {
            if(this._hexEditors[i] === hexEditor) {
                index = i;
                break;
            }
        }
        if(index === -1) {
            throw new Error('HexEditor not found');
        }
        this._hexEditors.splice(index, 1);
        this._emitter.on('did-remove-hexeditor', hexEditor, index);
    }

    onDidChangeActiveHexEditor(handler) {
        return this._emitter.on('did-change-active-hexeditor', handler);
    }

    onDidAddHexEdittor(handler) {
        return this._emitter.on('did-add-hexeditor', handler);
    }

    onDidRemoveHexEditor(handler) {
        return this._emitter.on('did-remove-hexeditor', handler);
    }

    dispose() {
        this._emitter.dispose();
    }
}
