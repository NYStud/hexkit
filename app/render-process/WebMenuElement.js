import HTMLTextElement from './HTMLTextElement';
import DisposableCollection from './DisposableCollection';
import WebMenuItemElement from './WebMenuItemElement';

export default class WebMenuElement extends HTMLTextElement {
    constructor(menu) {
        super('ul');
        this.addClass('menu');
        this.hidden = !menu.isOpen;
        this.subscriptions = new DisposableCollection();
        this.menu = menu;
        this.menuItemElements = [];
        this.menuItemClickSubs = [];
        this.menuItemMouseEnterSubs = [];

        this.subscriptions.add(this.menu.onMenuItemInserted(this._handleMenuItemInserted.bind(this)));
        this.subscriptions.add(this.menu.onMenuItemRemoved(this._handleMenuItemRemoved.bind(this)));
        this.subscriptions.add(this.menu.onOpen(this._handleOpen.bind(this)));
        this.subscriptions.add(this.menu.onClose(this._handleClose.bind(this)));

        let items = this.menu.items;
        for(let i = 0; i < items.length; i++) {
            console.log('items');
            this._addMenuItem(i, items[i]);
        }
    }

    _addMenuItem(position, item) {
        let menuItemElement = new WebMenuItemElement(item);
        if(position === this.menuItemElements.length) {
            menuItemElement.appendTo(this);
        } else {
            menuItemElement.insertBefore(this.menuItemElements[position]);
        }
        this.menuItemElements.splice(position, 0, menuItemElement);
        this.menuItemClickSubs.splice(position, 0, menuItemElement.on('click', this._handleClick.bind(this, item, menuItemElement)));
        this.menuItemMouseEnterSubs.splice(position, 0, menuItemElement.on('mouseenter', this._handleMouseEnter.bind(this, item, menuItemElement)));
    }

    _deleteMenuItem(position) {
        let menuItemElement = this.menuItemElements[position];
        this.menuItemElements.splice(position, 1);
        this.menuItemClickSubs.splice(position, 1)[0].dispose();
        this.menuItemMouseEnterSubs.splice(position, 1)[0].dispose();
        menuItemElement.remove();
        menuItemElement.dispose();
    }

    _handleMenuItemInserted(menuItem, position) {
        this._addMenuItem(position, menuItem);
    }

    _handleMenuItemRemoved(menuItem, position) {
        this._deleteMenuItem(position);
    }

    _closeAllItemsExcept(menuItem) {
        let items = this.menu.items;
        for(let i = 0; i < items.length; i++) {
            if(items[i] !== menuItem) {
                if(items[i].hasSubMenu) {
                    items[i].subMenu.close();
                    this.menuItemElements[i].active = false;
                }
            }
        }
    }

    _openItem(menuItem, menuItemElement, left, top) {
        this._closeAllItemsExcept(menuItem);
        if(menuItem.hasSubMenu) {
            menuItem.subMenu.open(left + 'px', top + 'px');
            console.log('setting active ' + left + ' ' + top);
            menuItemElement.active = true;
        }
    }

    _handleClick(menuItem) {
        setTimeout(menuItem.action.bind(menuItem), 0);
    }

    _handleMouseEnter(menuItem, menuItemElement) {
        if(menuItem.hasSubMenu) {
            this._openItem(menuItem, menuItemElement, menuItemElement.offsetLeft + menuItemElement.offsetWidth, menuItemElement.offsetTop);
        }
    }

    _handleOpen(x, y) {
        this.top = y;
        this.left = x;
        this.show();
    }

    _handleClose() {
        this.hidden = true;
    }

    dispose() {
        this.menu = null;
        this.subscriptions.dispose();
    }
}
