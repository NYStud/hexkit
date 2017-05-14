import HTMLElement from './HTMLElement';
import ScrollBarTrackElement from './ScrollBarTrackElement';
import DisposableCollection from './DisposableCollection';
import ScrollBarButtonElement from './ScrollBarButtonElement';

export default class ScrollBarElement extends HTMLElement {

    constructor(scrollbarParams) {
        super('div');
        this.addClass('scrollbar');

        this.scrollbarParams = scrollbarParams;

        this.disposables = new DisposableCollection();

        this.minusButtonElement = new ScrollBarButtonElement(scrollbarParams, true).appendTo(this);
        this.trackElement = new ScrollBarTrackElement(scrollbarParams).appendTo(this);
        this.plusButtonElement = new ScrollBarButtonElement(scrollbarParams, false).appendTo(this);

        this.disposables.add(this.scrollbarParams.onScroll(this.handleOnScroll.bind(this)));
        this.disposables.add(this.scrollbarParams.onEnable(this.handleOnEnable.bind(this)));
    }

    layoutOrientation() {
        if(this.scrollbarParams.vertical !== this._vertical) {
            this._vertical = this.scrollbarParams.vertical;
            this.removeClass(!this._vertical ? 'vertical' : 'horizontal');
            this.addClass(this._vertical ? 'vertical' : 'horizontal');
        }
    }

    layout() {
        this.layoutOrientation();
        this.trackElement.layout();
        this.scrollbarParams.layout();
    }

    onScroll(handler) {
        return this.scrollbarParams.onScroll(handler);
    }

    buttonStates() {
        if(this.scrollbarParams.canScrollUp !== this._canScrollUp) {
            this._canScrollUp = this.scrollbarParams.canScrollUp;
            this.minusButtonElement.disabled = !this._canScrollUp;
        }
        if(this.scrollbarParams.canScrollDown !== this._canScrollDown) {
            this._canScrollDown = this.scrollbarParams.canScrollDown;
            this.plusButtonElement.disabled = !this._canScrollDown;
        }
    }

    handleOnScroll() {
        this.buttonStates();
    }

    handleOnEnable() {
        this.buttonStates();
    }

    dispose() {
        this.disposables.dispose();
        this.trackElement.dispose();
        super.dispose();
    }
}
