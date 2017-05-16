import HTMLTextElement from './HTMLTextElement';
import DisposableCollection from './DisposableCollection';

export default class StatusBarPanelElement extends HTMLTextElement {

        constructor() {
            super('div');
            this.addClass('statusbar-panel');
            this.panel = null;
            this.panelSubs = null;
        }

        getPanel() {
            return this.panel;
        }

        setPanel(panel) {
            if(this.panelSubs !== null) {
                this.panelSubs.dispose();
                this.panelSubs = null;
            }
            this.panel = panel;
            this.panelSubs = new DisposableCollection();
            this.panelSubs.add(this.panel.onTextChange(this._handleOnTextChange.bind(this)));
        }

        _handleOnTextChange(text) {
            this.text = text;
        }

        dispose() {
            if(this.panelSubs !== null) {
                this.panelSubs.dispose();
                this.panelSubs = null;
            }
        }
}
