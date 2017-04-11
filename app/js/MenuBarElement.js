import MenuElement from './MenuElement';
import HTMLElement from './HTMLElement';
import EventTarget from './EventTarget';

export default class MenuBarElement extends MenuElement {
    constructor(menu) {
        super(menu);
        this.addClass('menu-bar');
        this.hidden = false;
        this.tracking = false;
        this.menuTopMask = new HTMLElement('div').addClass('menu-top-mask').hide().appendTo(this);
        this.windowEventTarget = new EventTarget(window);
        this.windowClickSubs = null;
    }

    _openItem(menuItem, menuItemElement, left, top) {
        super._openItem(menuItem, menuItemElement, left, top);
        this.menuTopMask.top = (top - 1) + 'px';
        this.menuTopMask.left = (left + menuItemElement.leftBorderWidth) + 'px';
        this.menuTopMask.width = (menuItemElement.offsetWidth - menuItemElement.leftBorderWidth - menuItemElement.rightBorderWidth) + 'px';
        this.menuTopMask.show();
    }

    _handleWindowClick() {
        console.log('click');
        this._endTrack();
    }

    _beginTrack(menuItem, menuItemElement) {
        this._openItem(menuItem, menuItemElement, menuItemElement.offsetLeft, menuItemElement.offsetTop + menuItemElement.offsetHeight);
        this.windowClickSubs = this.windowEventTarget.on('click', this._handleWindowClick.bind(this));
        this.tracking = true;
    }

    _endTrack() {
        this._closeAllItemsExcept(null);
        this.windowClickSubs.dispose();
        this.windowClickSubs = null;
        this.tracking = false;
    }

    _handleClick(menuItem, menuItemElement, e) {
        if(this.tracking === false) {
            this._beginTrack(menuItem, menuItemElement);
            e = e || window.event;
            EventTarget.pauseEvent(e);
        } else {
            this._endTrack();
        }
    }

    _handleMouseEnter(menuItem, menuItemElement) {
        if(this.tracking) {
            this._openItem(menuItem, menuItemElement, menuItemElement.offsetLeft, menuItemElement.offsetTop + menuItemElement.offsetHeight);
        }
    }

    dispose() {
    }
}
