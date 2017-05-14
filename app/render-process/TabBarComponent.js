import TabBarElement from './TabBarElement';
import Tab from './Tab';
import DisposableCollection from './DisposableCollection';
import HTMLElement from './HTMLElement';
import hexkit from 'hexkit';
import path from 'path';

export default class TabBarComponent {
    constructor() {
        let parent = new HTMLElement(document.body);

        this.tabBarElement = new TabBarElement(hexkit.tabBar).appendTo(parent);
        this.tabBar = hexkit.tabBar;
        this.subscriptions = new DisposableCollection();
        this.subscriptions.add(hexkit.hexEditorRegistry.onDidAdd(this.handleAddHexEditor.bind(this)));
        this.subscriptions.add(hexkit.hexEditorRegistry.onDidRemove(this.handleRemoveHexEditor.bind(this)));
        this.subscriptions.add(hexkit.hexEditorRegistry.onDidActivate(this.handleActivateHexEditor.bind(this)));
        this.subscriptions.add(hexkit.tabBar.onDidChangeActive(this.handleTabChange.bind(this)));
    }

    handleAddHexEditor(index, hexEditor) {
        let tab = new Tab(this.tabBar, path.basename(hexEditor.path));
        tab.sub = tab.onClose(this.handleClose.bind(this, index));
        this.tabBar.addTab(tab, false, index);
    }

    handleClose(index) {
        let hexEditor = hexkit.hexEditorRegistry.editors[index];
        hexkit.hexEditorRegistry.remove(hexEditor);
    }

    handleRemoveHexEditor(index) {
        let tab = this.tabBar.tabs[index];
        tab.sub.dispose();
        tab.sub = null;
        this.tabBar.removeTab(tab);
    }

    handleActivateHexEditor(index) {
        this.tabBar.activeTab = this.tabBar.tabs[index];
    }

    handleTabChange(tab, pos) {
        hexkit.hexEditorRegistry.activeHexEditor = hexkit.hexEditorRegistry.editors[pos];
    }

    dispose() {
        this.subscriptions.dispose();
        this.subscriptions = null;
    }
}
