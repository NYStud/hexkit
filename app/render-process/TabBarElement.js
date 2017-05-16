import HTMLElement from './HTMLElement';
import DisposableCollection from './DisposableCollection';
import TabElement from './TabElement';

export default class TabBarElement extends HTMLElement {
    constructor(tabs) {
        super('div');
        this.addClass('tab-bar');
        this.subscriptions = new DisposableCollection();
        this.tabs = tabs;
        this.tabElements = [];
        this.activeTabElement = null;
        this.subscriptions.add(tabs.onDidAddTab(this._handleAddTab.bind(this)));
        this.subscriptions.add(tabs.onDidRemoveTab(this._handleRemoveTab.bind(this)));
        this.subscriptions.add(tabs.onDidChangeActive(this._handleChangeActive.bind(this)));

        let i = 0;
        for(; i< tabs.tabs.length; i++) {
            this._addTab(tabs.tabs[i], i);
        }
    }

    _addTab(tab, position) {
        let tabElement = new TabElement(tab);
        if(position === this.tabElements.length) {
            tabElement.appendTo(this);
        } else {
            tabElement.insertBefore(this.tabElements[position]);
        }
        this.tabElements.splice(position, 0, tabElement);
    }

    _removeTab(position) {
        let tabElement = this.tabElements[position];
        this.tabElements.splice(position, 1);
        tabElement.remove();
        tabElement.dispose();
    }

    _handleAddTab(tab, position) {
        this._addTab(tab, position);
    }

    _handleRemoveTab(tab, position) {
        this._removeTab(position);
    }

    _handleChangeActive(tab, position) {
        if(this.activeTabElement !== null) {
            this.activeTabElement.active = false;
            this.activeTabElement = null;
        }
        this.activeTabElement = this.tabElements[position];
        this.activeTabElement.active = true;
    }

    dispose() {
        this.subscriptions.dispose();
        this.subscriptions = null;
    }
}
