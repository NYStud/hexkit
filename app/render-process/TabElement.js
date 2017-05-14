import HTMLElement from './HTMLElement';
import HTMLTextElement from './HTMLTextElement';
import DisposableCollection from './DisposableCollection';
import EvenetTarget from './EventTarget';

export default class TabElement extends HTMLElement {
    constructor(tab) {
        super('div');
        this.addClass('tab');
        this.subscriptions = new DisposableCollection();
        this.tab = tab;
        //title
        this.titleElement = new HTMLTextElement('div').addClass('title').appendTo(this);
        this.titleElement.text = tab.caption;
        //close button
        this.closeIcon = new HTMLElement('div').addClass('close-icon').appendTo(this);
        if(tab.isActive) {
            this.active = true;
        }
        this.subscriptions.add(this.closeIcon.on('click', this._handleCloseClick.bind(this)));
        this.subscriptions.add(tab.onDidChangeCaption(this._handleChangeCaption.bind(this)));
        this.subscriptions.add(this.on('click', this._handleClick.bind(this)));
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

    _handleClick(e) {
        e = e || window.event;
        this.tab.activate();
        EvenetTarget.pauseEvent(e);
    }

    _handleCloseClick(e) {
        e = e || window.event;
        this.tab.close();
        EvenetTarget.pauseEvent(e);
    }

    _handleChangeCaption(val) {
        this.titleElement.text = val;
    }

    set title(text) {
        this.titleElement.text = text;
    }

    get title() {
        return this.titleElement.text;
    }

    dispose() {
        this.subscriptions.dispose();
        this.subscriptions = null;
    }
}
