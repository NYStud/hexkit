import HTMLTextElement from './HTMLTextElement';
import MenuElement from './MenuElement';
import DisposableCollection from './DisposableCollection';

export default class MenuItemElement extends HTMLTextElement {
    constructor(menuItem) {
        super('li');
        this.addClass('menu-item');

        this.subscriptions = new DisposableCollection();

        if(menuItem.hasSubMenu) {
            this.subMenu = new MenuElement(menuItem.subMenu).appendTo(this);
        }
        this.text = menuItem.text;
        this.subscriptions.add(menuItem.onTextChanged(this._handleOnTextChanged.bind(this)));
    }

    get active() {
        return typeof this._active === 'undefined' ? false : this._active;
    }


    set active(active) {
        if(this.active !== active) {
            this._active = active;
            if(active) {
                this.addClass('active');
            } else {
                this.removeClass('active');
            }
        }
    }

    _handleOnTextChanged(val) {
        this.text = val;
    }

    dispose() {
        this.subscriptions.dispose();
    }
}
