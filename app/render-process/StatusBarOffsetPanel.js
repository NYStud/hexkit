import StatusBarPanel from './StatusBarPanel';
import DisposableCollection from './DisposableCollection';
import hexkit from 'hexkit';

export default class StatusBarOffsetPanel extends StatusBarPanel {
    constructor() {
        super();
        hexkit.statusBar.addPanel(this);
        this.text = 'Cursor: ---';
        this.subscriptions = new DisposableCollection();
        this.subscriptions.add(hexkit.hexEditorRegistry.onDidActivate(this.handleActivateHexEditor.bind(this)));
        this.offsetSub = null;
    }

    handleActivateHexEditor(hexEditor, activate) {
        if(this.offsetSub !== null) {
            this.offsetSub.dispose();
            this.offsetSub = null;
        }
        if(activate === false) {
            this.text = 'Cursor: ---';
        } else {
            this.text = 'Cursor: ' + hexEditor.cursor.getOffset();
            this.offsetSub = hexEditor.cursor.onCursorChange(this.handleCursorChange.bind(this));
        }
    }

    handleCursorChange(offset) {
        this.text = 'Cursor: ' + offset;
    }

    dispose() {
        if(this.offsetSub !== null) {
            this.offsetSub.dispose();
            this.offsetSub = null;
        }
        this.subscriptions.dispose();
        this.subscriptions = null;
    }
}
