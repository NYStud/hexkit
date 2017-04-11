import EventEmitter from './EventEmitter';

export default class Menu {
    constructor(items = [], open = false) {
        this._items = items;
        this._open = open;
        this.emitter = new EventEmitter();
    }

    get items() {
        return this._items;
    }

    insertMenuItem(menuItem, position) {
        if((position < 0) || (position > this._items.length)) {
            throw new RangeError('invalid position');
        }
        this._items.splice(position, 0, menuItem);
        this._dispatchMenuItemInserted(menuItem, position);
    }

    appendMenuItem(menuItem) {
        this.insertMenuItem(menuItem, this._items.length);
    }

    removeMenuItem(menuItem) {
        let position = -1;
        for(let i = 0; i < this._items.length; i++) {
            if(this._items[i] === menuItem) {
                position = i;
                break;
            }
        }
        if(position === -1) {
            throw new Error('menu item not found');
        }
        this._items.splice(position, 1);
        this._dispatchMenuItemRemoved(menuItem, position);
    }

    open(x, y) {
        this._dispatchOpen(x, y);
        this._open = true;
    }

    close() {
        if(this._open === false) {
            return;
        }
        this.items.forEach((item) => {
            if(item.hasSubMenu) {
                item.subMenu.close();
            }
        });
        this._dispatchClose();
        this._open = false;
    }

    get isOpen() {
        return this._open;
    }

    _dispatchMenuItemInserted(menu, position) {
        this.emitter.emit('menuItemInserted', menu, position);
    }

    _dispatchMenuItemRemoved(menu, position) {
        this.emitter.emit('menuItemRemoved', menu, position);
    }

    _dispatchOpen(x, y) {
        this.emitter.emit('open', x, y);
    }

    _dispatchClose() {
        this.emitter.emit('close');
    }

    onMenuItemInserted(handler) {
        return this.emitter.on('menuItemInserted', handler);
    }

    onMenuItemRemoved(handler) {
        return this.emitter.on('menuItemRemoved', handler);
    }

    onOpen(handler) {
        return this.emitter.on('open', handler);
    }

    onClose(handler) {
        return this.emitter.on('close', handler);
    }

    dispose() {
        this.emitter.dispose();
    }
}
