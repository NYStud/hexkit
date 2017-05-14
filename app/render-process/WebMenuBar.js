import WebMenu from './WebMenu';

export default class WebMenuBar extends WebMenu {
    constructor(items = []) {
        super(items);
    }

    //always open

    popup() {
    }

    closePopup() {
    }

    get isOpen() {
        return true;
    }

    static setApplicationMenu() {

    }

    static getApplicationMenu() {

    }

    static buildFromTemplate() {

    }
}
