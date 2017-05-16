import Platform from './Platform';
import WritableBinaryBuffer from './binarybuffer/WritableBinaryBuffer';
import HexEditor from './HexEditor';
import NativeFile from './NativeFile';
import hexkit from 'hexkit';

let dialog;

if(Platform.isElectron()) {
    dialog = require('electron').remote.dialog;
}

export default class OpenCommand {
    constructor() {
        this.register();
    }

    register() {
        hexkit.commandRegistry.add('application:open', this.openHandler.bind(this));
    }

    openHandler() {
        if(Platform.isElectron()) {
            const files = dialog.showOpenDialog({properties: ['openFile']});
            if(files) {
                let byteBuffer = new WritableBinaryBuffer(new NativeFile(files[0]));
                let hexEditor = new HexEditor(byteBuffer, files[0]);
                hexkit.hexEditorRegistry.add(hexEditor);
            }
        } else {
            document.getElementById('files').click();
        }
    }
}
