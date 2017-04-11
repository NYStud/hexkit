import TabBarElement from './TabBarElement';

export default class TabBarComponent {
    constructor(parentElement, tabs) {
        this.tabBarElement = new TabBarElement(tabs).appendTo(parentElement);
    }
}
