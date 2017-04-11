import ScrollViewElement from './ScrollViewElement';
import HexEditorViewElement from './HexEditorViewElement';


export default class HexEditorElement extends ScrollViewElement {

    constructor() {
        super(new HexEditorViewElement());
        this.addClass('editor');
    }

    dispose() {
        this.hexEditorViewElement.dispose();
        super.dispose();
    }

}
