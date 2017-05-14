import HTMLElement from './HTMLElement';
import ScrollBarElement from './ScrollBarElement';
import EventEmitter from './EventEmitter';
import DisposableCollection from './DisposableCollection';
import ScrollBarParams from './ScrollBarParams';


export default class ScrollViewElement extends HTMLElement {

    constructor(view) {

        if(!(view instanceof HTMLElement)) {
            throw new TypeError('element passed is not HTMLElement');
        }

        super('div');
        this.addClass('scrollview');

        this.emitter = new EventEmitter();

        this.viewElement = view.addClass('view').appendTo(this);

        this.verticalScrollbarParams = new ScrollBarParams();
        this.verticalScrollbarElement = new ScrollBarElement(this.verticalScrollbarParams).appendTo(this);

        this.disposables = new DisposableCollection();
        this.disposables.add(this.verticalScrollbarElement.onScroll(this.handleOnScroll.bind(this)));
        this.disposables.add(this.verticalScrollbarParams.onViewSize(this.handleOnViewSize.bind(this)));
        this.disposables.add(this.on('mousewheel', this.handleOnMouseWheel.bind(this)));
        this.disposables.add(this.on('DOMMouseScroll', this.handleOnMouseWheel.bind(this)));
    }

    reset() {
        this.verticalScrollbarParams.reset();
    }

    layout() {
        this.viewElement.layout();
        this.verticalScrollbarParams.viewSize = this.viewElement.viewHeight;
        this.verticalScrollbarElement.layout();
    }

    get view() {
        return this.viewElement;
    }

    get scrollHeight() {
        return this.verticalScrollbarParams.scrollSize;
    }

    set scrollHeight(size) {
        this.verticalScrollbarParams.scrollSize = size;
    }

    get scrollTop() {
        return this.verticalScrollbarParams.scrollPosition;
    }

    set scrollTop(size) {
        this.verticalScrollbarParams.scrollPosition = size;
    }

    onScroll(handler) {
        return this.emitter.on('scroll', handler);
    }

    onViewSize(handler) {
        return this.emitter.on('viewsize', handler);
    }

    dispatchOnScroll() {
        this.emitter.emit('scroll', 0, this.scrollTop);
    }

    dispatchOnViewSize() {
        this.emitter.emit('viewsize', 0, this.scrollTop);
    }

    handleOnScroll() {
        this.dispatchOnScroll();
    }

    handleOnViewSize() {
        this.dispatchOnViewSize();
    }

    handleOnMouseWheel(e) {
        e = window.event || e; // old IE support
        let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        this.verticalScrollbarParams.scrollPosition = this.verticalScrollbarParams.scrollPosition - delta;
    }

    dispose() {
        this.disposables.dispose();
        this.disposables = null;
        this.emitter.dispose();
        this.emitter = null;
        this.scrollbarElement.dispose();
        this.scrollbarElement = null;
        super.dispose();
    }
}
