import EventEmitter from './EventEmitter';

export default class MenuItem {
    constructor(isSeparator = false, text = '', subMenu = null) {
        this._text = text;
        this._isSeparator = isSeparator;
        this._subMenu = subMenu;
        this.emitter = new EventEmitter();
    }

    get text() {
        return this._text;
    }

    set text(val) {
        this._text = val;
        this._dispatchOnTextChanged(val);
    }

    get isSeparator() {
        return this._isSeparator;
    }

    get hasSubMenu() {
        return this._subMenu !== null;
    }

    get subMenu() {
        return this._subMenu;
    }

    action() {
        this._dispatchOnAction();
    }

    _dispatchOnTextChanged(val) {
        this.emitter.emit('textChanged', val);
    }

    _dispatchOnAction() {
        this.emitter.emit('action');
    }

    onTextChanged(handler) {
        return this.emitter.on('textChanged', handler);
    }

    onAction(handler) {
        return this.emitter.on('action', handler);
    }

    dispose() {
        this.emitter.dispose();
    }
}
