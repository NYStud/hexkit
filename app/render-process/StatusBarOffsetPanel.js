import StatusBarPanel from './StatusBarPanel';
import hexkit from 'hexkit';

export default class StatusBarOffsetPanel extends StatusBarPanel {
    constructor() {
        super();
        hexkit.statusBar.addPanel(this);
        this.text = 'Offset: ---';
    }
}
