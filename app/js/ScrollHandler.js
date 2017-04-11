export default class ScrollHandler {

    constructor(scrollFn, minus = true, scrollStep = 10, scrollInterval = 50, scrollOneShot = 800) {
        this.scrollFn = scrollFn;
        this.scrollStep = minus ? -scrollStep : scrollStep;
        this.scrollInterval = scrollInterval;
        this.scrollOneShot = scrollOneShot;

        this.scrolling = false;
        this.paused = false;

        this.intervalTimerID = null;
        this.oneShotTimerID = null;
    }

    scroll() {
        this.scrollFn(this.scrollStep);
    }

    handleOneShotTimer() {
        this.oneShotTimerID = null;
        this.intervalTimerID = setInterval(this.handleIntervalTimer.bind(this), this.scrollInterval);
    }

    handleIntervalTimer() {
        if(!this.paused) {
            this.scroll(this.scrollStep);
        }
    }

    started() {
        return this.scrolling;
    }

    begin() {
        if(this.scrolling) {
            return false;
        }
        this.scrolling = true;
        this.paused = false;
        this.scroll();
        this.oneShotTimerID = setTimeout(this.handleOneShotTimer.bind(this), this.scrollOneShot);
        return true;
    }

    pause() {
        this.paused = true;
        return true;
    }

    unpause() {
        this.paused = false;
        return true;
    }

    end() {
        if(!this.scrolling) {
            return false;
        }
        if(this.oneShotTimerID !== null) {
            clearTimeout(this.oneShotTimerID);
            this.oneShotTimerID = null;
        }
        if(this.intervalTimerID !== null) {
            clearInterval(this.intervalTimerID);
            this.intervalTimerID = null;
        }
        this.scrolling = false;
        return true;
    }
}
