import HTMLElement from './HTMLElement';
import Blinker from './Blinker';

export default class ClassBlinker extends Blinker {

    constructor(params) {
        super(params);
        /*jshint eqnull:true*/
        if(params.element == null) {
            throw new TypeError('invalid element');
        }
        if(!(params.element instanceof HTMLElement)) {
            throw new TypeError('element not instance of HTMLElement');
        }
        if(params.className == null) {
            throw new TypeError('invalid element');
        }
        this._element = params.element;
        this._className = params.className;
    }

    on() {
        this._element.addClass(this._className);
    }

    off() {
        this._element.removeClass(this._className);
    }
}
