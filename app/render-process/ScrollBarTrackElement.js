import HTMLElement from './HTMLElement';
import EventTarget from './EventTarget';
import DisposableCollection from './DisposableCollection';
import ScrollHandler from './ScrollHandler';

export default class ScrollBarTrackElement extends HTMLElement {

    constructor(scrollbarParams) {
        super('div');
        this.addClass('scrollbar-track');

        this.scrollbarParams = scrollbarParams;

        this.disposables = new DisposableCollection();
        this.windowEventTarget = new EventTarget(window);

        //grip
        this.gripElement = new HTMLElement('div').addClass('scrollbar-grip').appendTo(this);

        //track click scroll handlers
        this.minusScrollHandler = new ScrollHandler(this.scrollBy.bind(this), true);
        this.plusScrollHandler = new ScrollHandler(this.scrollBy.bind(this), false);

        //used for dragging
        this.startMouseOffset = 0;
        this.startGripOffset = 0;
        this.dragging = false;

        //event subscriptions
        this.disposables.add(this.windowEventTarget.on('mouseup', this.handleMouseUp.bind(this)));
        this.disposables.add(this.gripElement.on('mousedown', this.handleMouseDown.bind(this)));
        this.disposables.add(this.on('mousedown', this.handleTrackMouseDown.bind(this)));
        this.disposables.add(this.scrollbarParams.onGripPosition(this.handleOnGripPosition.bind(this)));
        this.disposables.add(this.scrollbarParams.onGripSize(this.handleOnGripSize.bind(this)));
        this.disposables.add(this.scrollbarParams.onEnable(this.handleOnEnable.bind(this)));
        this.moveSubscription = null;
        this.outSubscription = null;
    }

    scrollBy(step) {
        this.scrollbarParams.scrollPosition = this.scrollbarParams.scrollPosition + step;
    }

    setGripTop(value) {
        this.gripElement.top = (this.topPadding + value) + 'px';
    }

    setGripHeight(value) {
        this.gripElement.height = value + 'px';
    }

    setGripLeft(value) {
        this.gripElement.left = (this.leftPadding + value) + 'px';
    }

    setGripWidth(value) {
        this.gripElement.width = value + 'px';
    }

    getTrackWidth() {
        return parseInt(this.width, 10);
    }

    getTrackHeight() {
        return parseInt(this.height, 10);
    }

    getMouseTop(e) {
        return e.clientY;
    }

    getMouseLeft(e) {
        return e.clientX;
    }

    layoutOrientation() {
        if(this.scrollbarParams.vertical !== this._vertical) {
            this._vertical = this.scrollbarParams.vertical;
            if(this._vertical) {
                this.gripPositionFn = this.setGripTop;
                this.gripSizeFn = this.setGripHeight;
                this.mouseOffsetFn = this.getMouseTop;
                this.trackSizeFn = this.getTrackHeight;
                this.gripElement.left = '';
                this.gripElement.width = '';
            } else {
                this.gripPositionFn = this.setGripLeft;
                this.gripSizeFn = this.setGripWidth;
                this.mouseOffsetFn = this.getMouseLeft;
                this.trackSizeFn = this.getTrackWidth;
                this.gripElement.top = '';
                this.gripElement.height = '';
            }
        }
    }

    layout() {
        this.layoutOrientation();
        this.scrollbarParams.trackSize = this.trackSizeFn();
    }

    handleOnEnable(enabled) {
        this.gripElement.hidden = !enabled;
        this.disabled = !enabled;
    }

    handleOnGripPosition(position) {
        this.gripPositionFn(position);
    }

    handleOnGripSize(size) {
        this.gripSizeFn(size);
    }

    handleTrackMouseDown(e) {
        if(!this.scrollbarParams.canScroll) {
            return;
        }

        e = e || window.event;

        let offset = this.mouseOffsetFn(e);

        let ret = false;
        if(offset < this.scrollbarParams.gripPosition) {
            ret = this.minusScrollHandler.begin();
        } else if(offset > (this.scrollbarParams.gripPosition + this.scrollbarParams.gripSize)) {
            ret = this.plusScrollHandler.begin();
        }

        if(!ret) {
            return;
        }

        this.moveSubscription = this.on('mousemove', this.handleTrackMouseMove.bind(this), true);
        this.outSubscription = this.on('mouseleave', this.handleTrackMouseOut.bind(this), true);
        //this.enterSubscription = this.on('mouseenter', this.handleTrackMouseEnter.bind(this), true);

        return EventTarget.pauseEvent(e);
    }

    handleTrackMouseMove(e) {
        e = e || window.event;
        let offset = this.mouseOffsetFn(e);

        if(this.minusScrollHandler.started()) {

            if(offset > this.scrollbarParams.gripPosition) {
                this.minusScrollHandler.pause();
            } else {
                this.minusScrollHandler.unpause();
            }

        } else if(this.plusScrollHandler.started()) {

            if(offset < (this.scrollbarParams.gripPosition + this.scrollbarParams.gripSize)) {
                this.plusScrollHandler.pause();
            } else {
                this.plusScrollHandler.unpause();
            }

        }
    }

    handleTrackMouseOut() {
        this.minusScrollHandler.pause();
        this.plusScrollHandler.pause();
        console.log('out');
    }

    handleMouseDown(e) {
        if(!this.scrollbarParams.canScroll) {
            return;
        }

        e = e || window.event;

        this.moveSubscription = this.windowEventTarget.on('mousemove', this.handleMouseMove.bind(this), true);
        this.startMouseOffset = this.mouseOffsetFn(e);
        this.startGripOffset = this.scrollbarParams.gripPosition;
        this.dragging = true;

        return EventTarget.pauseEvent(e);
    }

    handleMouseMove(e) {
        e = e || window.event;

        this.scrollbarParams.gripPosition = this.startGripOffset + this.mouseOffsetFn(e) - this.startMouseOffset;

        return EventTarget.pauseEvent(e);
    }

    unsubscribeMouseMove() {
        this.moveSubscription.dispose();
        this.moveSubscription = null;
    }

    unsubscribeTrackMouseEvents() {
        this.moveSubscription.dispose();
        this.moveSubscription = null;
        this.outSubscription.dispose();
        this.outSubscription = null;
    }

    handleMouseUp() {
        if(this.dragging) {
            this.unsubscribeMouseMove();
            this.dragging = false;
            return;
        }
        if(this.minusScrollHandler.end() || this.plusScrollHandler.end()) {
            this.unsubscribeTrackMouseEvents();
            return;
        }
    }

    dispose() {
        this.handleMouseUp();
        this.disposables.dispose();
        super.dispose();
    }
}
