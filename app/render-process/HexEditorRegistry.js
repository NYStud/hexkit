import EventEmitter from './EventEmitter';

export default class HexEditorRegistry {
    constructor() {
        this.editors = [];
        this.emitter = new EventEmitter();
        this.activeIndex = -1;
    }

    add(hexEditor, activate = true, position = -1) {
        if((position < 0) || (position > this.editors.length)) {
            position = this.editors.length;
        }
        console.log('hex editor add position = ' + position);
        this.editors.splice(position, 0, hexEditor);
        this.emitter.emit('did-add', position, hexEditor);
        if((this.activeIndex === -1) || (activate === true)) {
            console.log('activating hex editor');
            this.activeHexEditor = hexEditor;
        }
    }

    remove(hexEditor) {
        let index = -1;
        for(let i = 0; i < this.editors.length; i++) {
            if(this.editors[i] === hexEditor) {
                index = i;
                break;
            }
        }
        if(index === -1) {
            return;
        }

        this.editors.splice(index, 1);
        this.emitter.emit('did-remove', index, hexEditor);

        if(index === this.activeIndex) {
            if(this.editors.count === 0) {
                this.activeHexEditor = null;
            } else if(index >= this.editors.length) {
                this.activeHexEditor = this.editors[this.editors.length - 1];
            } else {
                this.activeHexEditor = this.editors[index];
            }
        }

    }

    get activeHexEditor() {
        if(this.activeIndex < 0 || this.activeIndex > (this.editors.length - 1)) {
            return null;
        }
        return this.editors[this.activeIndex];
    }

    set activeHexEditor(hexEditor) {
        let index = -1;
        if(hexEditor !== null) {
            for(let i = 0; i < this.editors.length; i++) {
                if(this.editors[i] === hexEditor) {
                    index = i;
                    break;
                }
            }
        }
        this.activeIndex = index;
        this.emitter.emit('did-activate', index, hexEditor);
    }

    onDidAdd(handler) {
        return this.emitter.on('did-add', handler);
    }

    onDidRemove(handler) {
        return this.emitter.on('did-remove', handler);
    }

    onDidActivate(handler) {
        return this.emitter.on('did-activate', handler);
    }

    dispose() {
        this.emitter.dispose();
        this.emitter = null;
    }
}
