/*jshint bitwise: false*/
import HTMLElement from './HTMLElement';
import OffsetElement from './OffsetElement';
import OffsetGutterElement from './OffsetGutterElement';
import HexElement from './HexElement';
import GroupSeparatorElement from './GroupSeparatorElement';
import CharacterElement from './CharacterElement';
import ViewSeparatorElement from './ViewSeparatorElement';
import HexUtils from './HexUtils';
import DisposableCollection from './DisposableCollection';
import EventEmitter from './EventEmitter';
import HexSeparatorElement from './HexSeparatorElement';

const BYTES_PER_ROW = 16;

export default class HexEditorRowElement extends HTMLElement {

    constructor(offset) {
        super('div');
        this.addClass('editor-row');

        this.disposables = new DisposableCollection();
        this.emitter = new EventEmitter();

        this.offsetElement = new OffsetElement().appendTo(this);
        this.offset = offset;

        this.offsetGutterElement = new OffsetGutterElement().appendTo(this);

        this.hexElements = [];
        this.hexSpacingElements = [];
        for(let i = 0; i < (BYTES_PER_ROW * 2); i++) {
            this.hexElements.push(this.initHexElement(new HexElement(), i).appendTo(this));
            if(i === (BYTES_PER_ROW - 1)) {
                this.hexSpacingElements.push(new GroupSeparatorElement().appendTo(this));
            } else if(i + 1 < (BYTES_PER_ROW * 2) && i % 2 === 1) {
                this.hexSpacingElements.push(new HexSeparatorElement().appendTo(this));
            }
        }

        this.viewSeparatorElement = new ViewSeparatorElement().appendTo(this);

        this.charecterElements = [];
        for(let i = 0; i < BYTES_PER_ROW; i++) {
            this.charecterElements.push(this.initCharacterElement(new CharacterElement(), i).appendTo(this));
            if(i === (BYTES_PER_ROW/2 - 1)) {
                this.textGroupSeparatorElement = new GroupSeparatorElement().appendTo(this);
            }
        }

        new HTMLElement('div').addClass('fill-column').appendTo(this);

        this.focusIndex = -1;
        this.focusMode = -1;
    }

    initHexElement(el, i) {
        this.disposables.add(el.on('mouseover', this._handleHexMouseOver.bind(this, i)));
        this.disposables.add(el.on('mouseout', this._handleHexMouseOut.bind(this, i)));
        this.disposables.add(el.on('click', this._handleClick.bind(this, i >> 1, i & 1)));
        this.disposables.add(el.on('mousedown', this._handleMouseDown.bind(this, i >> 1, i & 1)));
        this.disposables.add(el.on('mouseup', this._handleMouseUp.bind(this, i >> 1, i & 1)));
        this.disposables.add(el.on('mousemove', this._handleMouseMove.bind(this, i >> 1, i & 1)));
        el.text = ' ';
        return el;
    }

    initCharacterElement(el, i) {
        this.disposables.add(el.on('mouseover', this._handleCharMouseOver.bind(this, i)));
        this.disposables.add(el.on('mouseout', this._handleCharMouseOut.bind(this, i)));
        this.disposables.add(el.on('click', this._handleClick.bind(this, i, 2)));
        this.disposables.add(el.on('mousedown', this._handleMouseDown.bind(this, i, 2)));
        this.disposables.add(el.on('mouseup', this._handleMouseUp.bind(this, i, 2)));
        this.disposables.add(el.on('mousemove', this._handleMouseMove.bind(this, i, 2)));
        el.text = ' ';
        return el;
    }

    onClick(handler) {
        return this.emitter.on('click', handler);
    }

    onMouseDown(handler) {
        return this.emitter.on('mousedown', handler);
    }

    onMouseUp(handler) {
        return this.emitter.on('mouseup', handler);
    }

    onMouseMove(handler) {
        return this.emitter.on('mousemove', handler);
    }

    onMouseOver(handler) {
        return this.emitter.on('mouseover', handler);
    }

    _handleHexMouseOver(i) {
        this.hexElements[i].hovered = true;
        this.charecterElements[i >> 1].hovered = true;
        this.emitter.emit('mouseover', i >> 1, i & 1);
    }

    _handleHexMouseOut(i) {
        this.hexElements[i].hovered = false;
        this.charecterElements[i >> 1].hovered = false;
    }

    _handleCharMouseOver(i, e) {
        this.hexElements[i << 1].hovered = true;
        this.charecterElements[i].hovered = true;
        this.emitter.emit('mouseover', i, 2, e);
    }

    _handleCharMouseOut(i) {
        this.hexElements[i << 1].hovered = false;
        this.charecterElements[i].hovered = false;
    }

    _handleClick(i, mode) {
        this.emitter.emit('click', i, mode);
    }

    _handleMouseDown(i, mode, e) {
        this.emitter.emit('mousedown', i, mode, e);
    }

    _handleMouseUp(i, mode, e) {
        this.emitter.emit('mouseup', i, mode, e);
    }

    _handleMouseMove(i, mode, e) {
        this.emitter.emit('mousemove', i, mode, e);
    }

    get size() {
        return BYTES_PER_ROW;
    }

    get offset() {
        return this._offset;
    }

    set offset(offset) {
        if(this._offset !== offset) {
            this._offset = offset;
            this.offsetElement.text = HexUtils.toHexString(offset);
        }
    }

    setFocus(index, mode) {
        if((index === this.focusIndex) && (mode === this.focusMode)) {
            return false;
        }
        if(index >= BYTES_PER_ROW) {
            return false;
        }
        if((mode < 0) && (mode > 2)) {
            return false;
        }
        this.addClass('focus');
        this.charecterElements[index].focused = true;
        if(mode === 0) {
            this.hexElements[index << 1].focused = true;
            this.hexElements[index << 1].cursor = true;
        } else if(mode === 1) {
            this.hexElements[(index << 1) + 1].focused = true;
            this.hexElements[(index << 1) + 1].cursor = true;
        } else if(mode === 2) {
            this.hexElements[index << 1].focused = true;
            this.hexElements[(index << 1) + 1].focused = true;
            this.charecterElements[index].cursor = true;
        }
        if(!this.charecterElements[index].focused) {
            return false;
        }
        this.focusIndex = index;
        this.focusMode = mode;
        return true;
    }

    clearFocus() {
        if((this.focusIndex === -1) || (this.focusMode === -1)) {
            return;
        }
        this.removeClass('focus');
        this.charecterElements[this.focusIndex].focused = false;
        if(this.focusMode === 0) {
            this.hexElements[this.focusIndex << 1].focused = false;
            this.hexElements[this.focusIndex << 1].cursor = false;
        } else if(this.focusMode === 1) {
            this.hexElements[(this.focusIndex << 1) + 1].focused = false;
            this.hexElements[(this.focusIndex << 1) + 1].cursor = false;
        } else if(this.focusMode === 2) {
            this.hexElements[this.focusIndex << 1].focused = false;
            this.hexElements[(this.focusIndex << 1) + 1].focused = false;
            this.charecterElements[this.focusIndex].cursor = false;
        }
        this.focusIndex = -1;
        this.focusMode = -1;
    }

    dispose() {
        this.offsetElement.dispose();
        this.offsetElement = null;
        this.offsetGutterElement.dispose();
        this.offsetGutterElement = null;
        while(this.hexElements.length > 0) {
            this.hexElements.pop().dispose();
        }
        this.hexElements = null;
        while(this.hexSpacingElements.length > 0) {
            this.hexSpacingElements.pop().dispose();
        }
        this.hexSpacingElements = null;
        this.viewSeparatorElement.dispose();
        this.viewSeparatorElement = null;
        while(this.charecterElements.length > 0) {
            this.charecterElements.pop().dispose();
        }
        this.charecterElements = null;
        this.textGroupSeparatorElement.dispose();
        this.textGroupSeparatorElement = null;
        this.disposables.dispose();
        this.disposables = null;
        this.emitter.dispose();
        this.emitter = null;
        super.dispose();
    }
}
