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
        tab.sub = tab.onClose(this.handleClose.bind(this, tab));
        tab.hexEditor = hexEditor;
        this.tabBar.addTab(tab, false, index);
    }

    handleClose(tab) {
        let hexEditor = tab.hexEditor;
        hexkit.hexEditorRegistry.remove(hexEditor);
    }

    handleRemoveHexEditor(index) {
        let tab = this.tabBar.tabs[index];
        tab.sub.dispose();
        tab.sub = null;
        tab.hexEditor = null;
        this.tabBar.removeTab(tab);
    }

    handleActivateHexEditor(hexEditor, activate) {
        if(activate === false) {
            this.tabBar.activeTab = null;
        } else {
            this.tabBar.tabs.forEach(tab => {
                if(tab.hexEditor === hexEditor) {
                    this.tabBar.activeTab = tab;
                }
            });
        }
    }

    handleTabChange(tab) {
        hexkit.hexEditorRegistry.activeHexEditor = tab.hexEditor;
    }

    dispose() {
        this.subscriptions.dispose();
        this.subscriptions = null;
    }
}
