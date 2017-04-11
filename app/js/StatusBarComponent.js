import StatusBarElement from './StatusBarElement';
import DisposableCollection from './DisposableCollection';
import StatusBarPanelElement from './StatusBarPanelElement';

export default class StatusBarComponent {

    constructor(parentElement) {
        this.disposables = new DisposableCollection();
        this.statusbarSubs = null;
        this.statusbarElement = new StatusBarElement();
        this.statusbarElement.appendTo(parentElement);
        this.statusbar = null;
    }

    setStatusBar(statusbar) {
        if(this.statusbarSubs !== null) {
            this.statusbarSubs.dispose();
            this.statusbarSubs = null;
        }
        this.statusbar = statusbar;
        this.panelElements = new Set();
        this.statusbarSubs = new DisposableCollection();
        this.statusbarSubs.add(this.statusbar.onAdd(this._handleOnAdd.bind(this)));
        this.statusbarSubs.add(this.statusbar.onDelete(this._handleOnDelete.bind(this)));
    }

    _handleOnAdd(panel) {
        let panelElement = new StatusBarPanelElement();
        panelElement.setPanel(panel);
        panelElement.appendTo(this.statusbarElement);
        this.panelElements.add(panelElement);
    }

    _handleOnDelete(panel) {
        var found = null;
        this.panels.forEach((p) => {
            if(p.getPanel() === panel) {
                found = p;
            }
        });
        if(found !== null) {
            found.dispose();
            found.remove();
            this.panelElements.delete(found);
        }
    }

    dispose() {
        if(this.statusbarSubs !== null) {
            this.statusbarSubs.dispose();
            this.statusbarSubs = null;
        }
        this.disposables.dispose();
    }
}
