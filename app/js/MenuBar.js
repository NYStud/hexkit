import Menu from './Menu';

export default class MenuBar extends Menu {
    constructor(items = []) {
        super(items);
    }

    //always open

    open() {
    }

    close() {
    }

    get isOpen() {
        return true;
    }
}
