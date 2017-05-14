import EventEmitter from './EventEmitter';

export default class WebMenuItem {
    constructor(options) {
        if(options === null || options === undefined) {
            options = {};
        }
        this._click = options.click === null || options.click === undefined ? null : options.click;
        this._role = options.role === null || options.role === undefined ? null : options.role;
        this._type = options.type === null || options.type === undefined ? 'normal' : options.type;
        this._label = options.label === null || options.label === undefined ? '' : options.label;
        this._sublabel = options.sublabel === null || options.sublabel === undefined ? '' : options.sublabel;
        this._accelerator = options.accelerator === null || options.accelerator === undefined ? null : options.accelerator;
        this._icon = options.icon === null || options.icon === undefined ? null : options.icon;
        this._enable = options.enable === null || options.enable === undefined ? true : options.enable;
        this._visible = options.visible === null || options.visible === undefined ? true : options.visible;
        this._checked = options.checked === null || options.checked === undefined ? false : options.checked;
        this._submenu = options.submenu === null || options.submenu === undefined ? null : options.submenu;
        this._id = options.id === null || options.id === undefined ? '' : options.id;
        this._position = options.position === null || options.position === undefined ? 0 : options.position;
        this.emitter = new EventEmitter();
    }

    get label() {
        return this._label;
    }

    set label(val) {
        this._label = val;
        this._dispatchOnLabel(val);
    }

    get click() {
        return this._click;
    }

    set click(val) {
        this._click = val;
    }

    get enable() {
        return this.enable;
    }

    set enable(val) {
        this._enable = val;
        this._dispatchOnEnable(val);
    }

    get visible() {
        return this.visible;
    }

    set visible(val) {
        this._visible = val;
        this._dispatchOnVisible(val);
    }

    get checked() {
        return this.checked;
    }

    set checked(val) {
        this._checked = val;
        this._dispatchOnChecked(val);
    }

    dispatchClick() {
        this.click();
    }

    _dispatchOnLabel(val) {
        this.emitter.emit('label', val);
    }

    _dispatchOnEnable(val) {
        this.emitter.emit('enable', val);
    }

    _dispatchOnVisible(val) {
        this.emitter.emit('visible', val);
    }

    _dispatchOnChecked(val) {
        this.emitter.emit('checked', val);
    }

    onLabel(handler) {
        return this.emitter.on('label', handler);
    }

    onEnable(handler) {
        return this.emitter.on('enable', handler);
    }

    onVisible(handler) {
        return this.emitter.on('visible', handler);
    }

    onChecked(handler) {
        return this.emitter.on('checked', handler);
    }

    dispose() {
        this.emitter.dispose();
    }
}
