import StatusBarElement from './StatusBarElement';
import DisposableCollection from './DisposableCollection';
import StatusBarPanelElement from './StatusBarPanelElement';
import HTMLElement from './HTMLElement';
import hexkit from 'hexkit';

export default class StatusBarComponent {

    constructor() {
        let parent = new HTMLElement(document.body);

        this.disposables = new DisposableCollection();
        this.statusbarElement = new StatusBarElement();
        this.statusbarElement.appendTo(parent);
        this.panelElements = [];
        this.statusbar = hexkit.statusBar;
        this.disposables.add(this.statusbar.onAdd(this._handleOnAdd.bind(this)));
        this.disposables.add(this.statusbar.onDelete(this._handleOnDelete.bind(this)));
    }

    _handleOnAdd(panel) {
        let panelElement = new StatusBarPanelElement();
        panelElement.setPanel(panel);
        panelElement.appendTo(this.statusbarElement);
        this.panelElements.push(panelElement);
    }

    _handleOnDelete(panel) {
        let index = -1;
        this.panelElements.forEach((p, i) => {
            if(p.getPanel() === panel) {
                index = i;
            }
        });
        if(index !== -1) {
            this.panelElements[index].remove();
            this.panelElements[index].dispose();
            this.panelElements.splice(index, 1);
        }
    }

    dispose() {
        this.disposables.dispose();
        this.disposables = null;
    }
}
