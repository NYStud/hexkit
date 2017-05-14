import StatusBarPanel from './StatusBarPanel';
import hexkit from 'hexkit';

export default class StatusBarSelectionPanel extends StatusBarPanel {
    constructor() {
        super();
        hexkit.statusBar.addPanel(this);
        this.text = 'Selection: ---';
    }
}
