import HTMLElement from './HTMLElement';
import DisposableCollection from './DisposableCollection';
import EventTarget from './EventTarget';
import ScrollHandler from './ScrollHandler';

export default class ScrollBarButtonElement extends HTMLElement {

    constructor(scrollbarParams, minus = true, disabled = false) {
        super('div');
        this.addClass('scrollbar-button');
        if(minus) {
            this.addClass('minus');
        } else {
            this.addClass('plus');
        }
        this.disabled = disabled;
        this.scrollbarParams = scrollbarParams;

        //event subscriptions
        let disposables = new DisposableCollection();
        this.windowEventTarget = new EventTarget(window);
        disposables.add(this.windowEventTarget.on('mouseup', this.handleMouseUp.bind(this)));
        disposables.add(this.on('mousedown', this.handleMouseDown.bind(this)));
        this.disposables = disposables;

        this.scrollHandler = new ScrollHandler(this.scroll.bind(this), minus);

        this.enterSubscription = null;
        this.leaveSubscription = null;
    }

    scroll(step) {
        this.scrollbarParams.scrollPosition = this.scrollbarParams.scrollPosition + step;
    }

    handleMouseDown(e) {
        e = e || window.event;
        if(this.disabled) {
            return;
        }
        if(!this.scrollHandler.begin()) {
            return;
        }
        this.enterSubscription = this.on('mouseenter', this.handleMouseEnter.bind(this));
        this.leaveSubscription = this.on('mouseleave', this.handleMouseLeave.bind(this));
        return EventTarget.pauseEvent(e);
    }

    handleMouseEnter(e) {
        e = e || window.event;
        this.scrollHandler.unpause();
        return EventTarget.pauseEvent(e);
    }

    handleMouseLeave(e) {
        e = e || window.event;
        this.scrollHandler.pause();
        return EventTarget.pauseEvent(e);
    }

    unsubscribeMouseMove() {
        this.enterSubscription.dispose();
        this.enterSubscription = null;
        this.leaveSubscription.dispose();
        this.leaveSubscription = null;
    }

    handleMouseUp() {
        if(this.scrollHandler.end()) {
            this.unsubscribeMouseMove();
        }
    }

}
