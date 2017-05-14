import HexEditorRegistry from './HexEditorRegistry';
export default class Workspace {
    constructor() {
        this._hexEditorRegistry = new HexEditorRegistry();
    }

    get hexEditorRegistry() {
        return this._hexEditorRegistry;
    }
}
