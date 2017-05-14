import hexkit from 'hexkit';

export default class CloseCommand {
    constructor() {
        this.register();
    }

    register() {
        hexkit.commandRegistry.add('core:close', this.handleTabClose.bind(this));
        hexkit.commandRegistry.add('window:close', this.handleWindowClose.bind(this));
    }

    handleTabClose() {
        let hexEditor = hexkit.hexEditorRegistry.activeHexEditor;
        hexkit.hexEditorRegistry.remove(hexEditor);
    }

    handleWindowClose() {

    }
}
