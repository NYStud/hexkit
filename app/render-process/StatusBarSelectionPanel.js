import StatusBarPanel from './StatusBarPanel';
import DisposableCollection from './DisposableCollection';
import hexkit from 'hexkit';

export default class StatusBarSelectionPanel extends StatusBarPanel {
    constructor() {
        super();
        hexkit.statusBar.addPanel(this);
        this.text = 'Selection: ---';
        this.subscriptions = new DisposableCollection();
        this.subscriptions.add(hexkit.hexEditorRegistry.onDidActivate(this.handleActivateHexEditor.bind(this)));
        this.selectionSub = null;
    }

    handleActivateHexEditor(hexEditor, activate) {
        if(this.selectionSub !== null) {
            this.selectionSub.dispose();
            this.selectionSub = null;
        }
        if(activate === false) {
            this.text = 'Selection: ---';
        } else {
            if((hexEditor.selection.start === -1) || (hexEditor.selection.end === -1)) {
                this.text = 'Selection: ---';
            } else {
                this.text = 'Selection: ' + hexEditor.selection.start + ' - ' + hexEditor.selection.end;
            }
            this.selectionSub = hexEditor.selection.onSelectionChange(this.handleSelectionChange.bind(this));
        }
    }

    handleSelectionChange(start, end) {
        if((start === -1) || (end === -1)) {
            this.text = 'Selection: ---';
        } else {
            this.text = 'Selection: ' + start + ' - ' + end;
        }
    }

    dispose() {
        if(this.selectionSub !== null) {
            this.selectionSub.dispose();
            this.selectionSub = null;
        }
        this.subscriptions.dispose();
        this.subscriptions = null;
    }
}
