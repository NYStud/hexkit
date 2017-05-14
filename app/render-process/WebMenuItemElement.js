import HTMLTextElement from './HTMLTextElement';
import WebMenuElement from './WebMenuElement';
import DisposableCollection from './DisposableCollection';

export default class WebMenuItemElement extends HTMLTextElement {
    constructor(menuItem) {
        super('li');
        this.addClass('menu-item');

        this.subscriptions = new DisposableCollection();

        if(menuItem.type === 'submenu') {
            this.submenu = new WebMenuElement(menuItem.submenu).appendTo(this);
        }
        
        this.text = menuItem.label;
        this.disabled = !menuItem.enable;
        this.hidden = !menuItem.visible;
        this.checked = menuItem.checked;
        this.subscriptions.add(menuItem.onLabel(this._handleOnLabel.bind(this)));
        this.subscriptions.add(menuItem.onEnable(this._handleOnEnable.bind(this)));
        this.subscriptions.add(menuItem.onVisible(this._handleOnVisible.bind(this)));
        this.subscriptions.add(menuItem.onChecked(this._handleOnChecked.bind(this)));
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

    get checked() {
        return typeof this._checked === 'undefined' ? false : this._checked;
    }


    set checked(active) {
        if(this.checked !== active) {
            this._checked = active;
            if(active) {
                this.addClass('checked');
            } else {
                this.removeClass('checked');
            }
        }
    }

    _handleOnLabel(val) {
        this.text = val;
    }

    _handleOnEnable(val) {
        this.disabled = !val;
    }

    _handleOnVisible(val) {
        this.hidden = !val;
    }

    _handleOnChecked(val) {
        this.checked = val;
    }

    dispose() {
        this.subscriptions.dispose();
    }
}
