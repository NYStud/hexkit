import EventEmitter from './EventEmitter';

export default class ScrollBarParams {

    constructor(minGripSize = 50, scrollSize = 0, viewSize = 0, trackSize = 0, vertical = true) {

        this.emitter = new EventEmitter();

        //set layout arguments
        this.scrollSize = scrollSize;
        this.viewSize = viewSize;
        this.trackSize = trackSize;
        this.minGripSize = minGripSize;
        this.vertical = vertical;

        this._scrollPosition = 0;
    }

    reset() {
        this._scrollPosition = 0;
    }

    //getters/setters for layout arguments

    get scrollSize() {
        return this._scrollSize;
    }

    set scrollSize(value) {
        if(value < 0) {
            throw new RangeError('scrollSize < 0');
        }
        this._scrollSize = value;
    }

    get viewSize() {
        return this._viewSize;
    }

    set viewSize(value) {
        if(value < 0) {
            throw new RangeError('viewSize < 0');
        }
        if(value !== this._viewSize) {
            this._viewSize = value;
            this.dispatchOnViewSize();
        }
    }

    get trackSize() {
        return this._trackSize;
    }

    set trackSize(value) {
        if(value < 0) {
            throw new RangeError('trackSize < 0');
        }
        this._trackSize = value;
    }

    get minGripSize() {
        return this._minGripSize;
    }

    set minGripSize(value) {
        if(value <= 0) {
            throw new RangeError('minGripSize <= 0');
        }
        this._minGripSize = value;
    }

    get vertical() {
        return this._vertical;
    }

    set vertical(value) {
        this._vertical = value;
    }

    //layout values calculation

    layout() {

        if(this.trackSize === 0) {
            //cannot show track
            this.enabled = false;
            return;
        }

        if(this.viewSize >= this.scrollSize) {
            //scrolling doesn't make sense
            this._ratio = 1;
            this.scrollPosition = 0;
            this._maxScrollPosition = 0;
            this._maxGripPosition = 0;
            this.enabled = false;
            return;
        }

        this.enabled = true;

        //old scroll position
        let scrollPosition = this.scrollPosition;

        //grip size, clampped to minGripSize, clipped to trackSize
        let gripSize = this.trackSize / this.scrollSize * this.viewSize;
        if(gripSize < this.minGripSize) {
            gripSize = this.minGripSize;
        }
        if(gripSize > this.trackSize) {
            gripSize = this.trackSize;
        }
        this.gripSize = gripSize;

        //maxScrollPosition
        this._maxScrollPosition = this.scrollSize - this.viewSize;

        //maxGripPosition
        this._maxGripPosition = this.trackSize - this.gripSize;

        //ratio
        this._ratio = this.maxScrollPosition / this.maxGripPosition;

        //update scroll position
        this.scrollPosition = scrollPosition;
    }

    onScroll(handler) {
        return this.emitter.on('scroll', handler);
    }

    onGripPosition(handler) {
        return this.emitter.on('gripposition', handler);
    }

    onGripSize(handler) {
        return this.emitter.on('gripsize', handler);
    }

    onEnable(handler) {
        return this.emitter.on('enable', handler);
    }

    onViewSize(handler) {
        return this.emitter.on('viewsize', handler);
    }

    dispatchOnScroll() {
        this.emitter.emit('scroll', this.scrollPosition);
    }

    dispatchOnGripPosition() {
        this.emitter.emit('gripposition', this.gripPosition);
    }

    dispatchOnGripSize() {
        this.emitter.emit('gripsize', this.gripSize);
    }

    dispatchOnEnable() {
        this.emitter.emit('enable', this.enabled);
    }

    dispatchOnViewSize() {
        this.emitter.emit('viewsize', this.viewSize);
    }

    //setters for updating position

    get scrollPosition() {
        return this._scrollPosition;
    }

    set scrollPosition(scrollPosition) {
        if(scrollPosition < 0) {
            scrollPosition = 0;
        }
        if(scrollPosition > this.maxScrollPosition) {
            scrollPosition = this.maxScrollPosition;
        }
        console.log('scrollPosition ' + scrollPosition + ' ' + this.maxScrollPosition);
        let gripPosition = Math.round(scrollPosition / this.ratio);
        if(scrollPosition !== this._scrollPosition) {
            this._scrollPosition = scrollPosition;
            this.dispatchOnScroll();
        }
        if(gripPosition !== this._gripPosition) {
            this._gripPosition = gripPosition;
            this.dispatchOnGripPosition();
        }
    }

    get gripPosition() {
        return this._gripPosition;
    }

    set gripPosition(gripPosition) {
        if(gripPosition < 0) {
            gripPosition = 0;
        }
        if(gripPosition > this.maxGripPosition) {
            gripPosition = this.maxGripPosition;
        }
        let scrollPosition = Math.round(gripPosition * this.ratio);
        if(gripPosition !== this._gripPosition) {
            this._gripPosition = gripPosition;
            this.dispatchOnGripPosition();
        }
        if(scrollPosition !== this._scrollPosition) {
            this._scrollPosition = scrollPosition;
            this.dispatchOnScroll();
        }
    }

    get gripSize() {
        return this._gripSize;
    }

    set gripSize(gripSize) {
        if(gripSize !== this._gripSize) {
            this._gripSize = gripSize;
            this.dispatchOnGripSize();
        }
    }

    get enabled() {
        return this._enabled;
    }

    set enabled(enabled) {
        if(enabled !== this._enabled) {
            this._enabled = enabled;
            this.dispatchOnEnable();
        }
    }

    get maxScrollPosition() {
        return this._maxScrollPosition;
    }

    get maxGripPosition() {
        return this._maxGripPosition;
    }

    get ratio() {
        return this._ratio;
    }

    get canScroll() {
        return this.viewSize < this.scrollSize;
    }

    get canScrollUp() {
        return this.enabled && (this.scrollPosition !== 0);
    }

    get canScrollDown() {
        return this.enabled && (this.scrollPosition !== this.maxScrollPosition);
    }
}
