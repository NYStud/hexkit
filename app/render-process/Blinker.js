
export default class Blinker {

    defined(val, def) {
        /*jshint eqnull:true*/
        if(val == null) {
            return def;
        }
        return val;
    }

    constructor(params) {

        this._onDuration = this.defined(params.onDuration, 500);
        this._offDuration = this.defined(params.offDuration, 500);
        this._isOn = false;
        this._timeout = null;
        this._isEnabled = this.defined(params.enabled, false);

    }

    enable() {
        if(this._isEnabled === true) {
            return;
        }
        this._isEnabled = true;
        this._on();
        this._onTimeout();
    }

    disable() {
        if(this._isEnabled === false) {
            return;
        }
        this._isEnabled = false;
        this._clearTimeout();
        this._off();
    }

    _onTimeout() {
        this._timeout = setTimeout(this._handleOnTimeout.bind(this), this._onDuration);
    }

    _offTimeout() {
        this._timeout = setTimeout(this._handleOffTimeout.bind(this), this._offDuration);
    }

    _clearTimeout() {
        if(this._timeout !== null) {
            clearTimeout(this._timeout);
            this._timeout = null;
        }
    }

    _handleOnTimeout() {
        this._off();
        this._offTimeout();
    }

    _handleOffTimeout() {
        this._on();
        this._onTimeout();
    }

    on() { }

    off() { }

    _on() {
        this._isOn = true;
        this.on();
    }

    _off() {
        this._isOn = false;
        this.off();
    }

    get isOn() {
        return this._isOn;
    }

    get isEnabled() {
        return this._isEnabled;
    }
}
