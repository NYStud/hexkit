/*jshint bitwise: false*/
import ScrollViewChildElement from './ScrollViewChildElement';
import HexEditorRowElement from './HexEditorRowElement';
import DisposableCollection from './DisposableCollection';
import EventEmitter from './EventEmitter';
import CharUtils from './CharUtils';
import HexUtils from './HexUtils';
import EventTarget from './EventTarget';
import TypedArrayUtils from './TypedArrayUtils';

const BORDER_TOP = 1;
const BORDER_LEFT = 2;
const BORDER_RIGHT = 4;
const BORDER_BOTTOM = 8;
const BORDER_ALL = BORDER_TOP | BORDER_LEFT | BORDER_RIGHT | BORDER_BOTTOM;
const SELECTED = 16;

const selectionBorderClasssMap0 = [];
const selectionBorderClasssMap1 = [];
const selectionBorderClasssMap2 = [];

selectionBorderClasssMap0[0] = 'select-border-none';
selectionBorderClasssMap0[BORDER_TOP] = 'select-border-top';
selectionBorderClasssMap0[BORDER_LEFT] = 'select-border-left';
selectionBorderClasssMap0[BORDER_RIGHT] = '';
selectionBorderClasssMap0[BORDER_BOTTOM] = 'select-border-bottom';
selectionBorderClasssMap0[BORDER_TOP | BORDER_LEFT] = 'select-border-top-left';
selectionBorderClasssMap0[BORDER_TOP | BORDER_RIGHT] = 'select-border-top';
selectionBorderClasssMap0[BORDER_BOTTOM | BORDER_LEFT] = 'select-border-bottom-left';
selectionBorderClasssMap0[BORDER_BOTTOM | BORDER_RIGHT] = 'select-border-bottom';
selectionBorderClasssMap0[BORDER_TOP | BORDER_BOTTOM] = 'select-border-top-bottom';
selectionBorderClasssMap0[BORDER_TOP | BORDER_LEFT | BORDER_BOTTOM] = 'select-border-top-left-bottom';
selectionBorderClasssMap0[BORDER_TOP | BORDER_RIGHT | BORDER_BOTTOM] = 'select-border-top-bottom';
selectionBorderClasssMap0[BORDER_TOP | BORDER_LEFT | BORDER_BOTTOM | BORDER_RIGHT] = 'select-border-top-left-bottom';

selectionBorderClasssMap1[0] = 'select-border-none';
selectionBorderClasssMap1[BORDER_TOP] = 'select-border-top';
selectionBorderClasssMap1[BORDER_LEFT] = '';
selectionBorderClasssMap1[BORDER_RIGHT] = 'select-border-right';
selectionBorderClasssMap1[BORDER_BOTTOM] = 'select-border-bottom';
selectionBorderClasssMap1[BORDER_TOP | BORDER_LEFT] = 'select-border-top';
selectionBorderClasssMap1[BORDER_TOP | BORDER_RIGHT] = 'select-border-top-right';
selectionBorderClasssMap1[BORDER_BOTTOM | BORDER_LEFT] = 'select-border-bottom';
selectionBorderClasssMap1[BORDER_BOTTOM | BORDER_RIGHT] = 'select-border-bottom-right';
selectionBorderClasssMap1[BORDER_TOP | BORDER_BOTTOM] = 'select-border-top-bottom';
selectionBorderClasssMap1[BORDER_TOP | BORDER_LEFT | BORDER_BOTTOM] = 'select-border-top-bottom';
selectionBorderClasssMap1[BORDER_TOP | BORDER_RIGHT | BORDER_BOTTOM] = 'select-border-top-right-bottom';
selectionBorderClasssMap1[BORDER_TOP | BORDER_LEFT | BORDER_BOTTOM | BORDER_RIGHT] = 'select-border-top-right-bottom';

selectionBorderClasssMap2[0] = 'select-border-none';
selectionBorderClasssMap2[BORDER_TOP] = 'select-border-top';
selectionBorderClasssMap2[BORDER_LEFT] = 'select-border-left';
selectionBorderClasssMap2[BORDER_RIGHT] = 'select-border-right';
selectionBorderClasssMap2[BORDER_BOTTOM] = 'select-border-bottom';
selectionBorderClasssMap2[BORDER_TOP | BORDER_LEFT] = 'select-border-top-left';
selectionBorderClasssMap2[BORDER_TOP | BORDER_RIGHT] = 'select-border-top-right';
selectionBorderClasssMap2[BORDER_BOTTOM | BORDER_LEFT] = 'select-border-bottom-left';
selectionBorderClasssMap2[BORDER_BOTTOM | BORDER_RIGHT] = 'select-border-bottom-right';
selectionBorderClasssMap2[BORDER_TOP | BORDER_BOTTOM] = 'select-border-top-bottom';
selectionBorderClasssMap2[BORDER_TOP | BORDER_LEFT | BORDER_BOTTOM] = 'select-border-top-left-bottom';
selectionBorderClasssMap2[BORDER_TOP | BORDER_RIGHT | BORDER_BOTTOM] = 'select-border-top-right-bottom';
selectionBorderClasssMap2[BORDER_TOP | BORDER_LEFT | BORDER_BOTTOM | BORDER_RIGHT] = 'select-border-top-left-bottom-right';

export default class HexEditorViewElement extends ScrollViewChildElement {

    constructor() {
        super('div');

        this.addClass('editor-view');

        this.emitter = new EventEmitter();
        this.disposables = new DisposableCollection();
        this.windowEventTarget = new EventTarget(window);

        //constant for all rows
        this.rowHeight = 0;
        this.rowSize = 0;

        this.rows = [];

        this.rowCount = 0;
        this.offset = 0;
        this.dataLength = 0;

        this._cursorOffset = -1; //offset in view
        this._cursorMode = -1; //0-fisthex,1-secondhex,2-character

        this.disposables.add(this.windowEventTarget.on('mouseup', this._handleMouseUp.bind(this)));

        this._mouseDown = false;
        this._selectMode = false;
        this._selectionBegin = -1;
        this._selectionEnd = -1;
        this._selectionMap = TypedArrayUtils.Uint8Array(1);
        this._dirtyMap = TypedArrayUtils.Uint8Array(1);
    }

    get rowCount() {
        return this.viewHeight;
    }

    set rowCount(rowCount) {
        this.viewHeight = rowCount;
    }

    get size() {
        return this.rowCount * this.rowSize;
    }

    get offset() {
        return this._offset;
    }

    set offset(offset) {
        if(this._offset === offset) {
            return;
        }
        this._offset = offset;
        for(let i = 0; i < this.rowCount; i++) {
            this.rows[i].offset = this.getRowOffset(i);
        }
    }

    getRowOffset(index) {
        return this.offset + index * this.rowSize;
    }

    getRowIndex(offset) {
        return Math.floor(offset / this.rowSize);
    }

    getColumnIndex(offset) {
        return Math.floor(offset % this.rowSize);
    }

    _handleClick(row, column, mode) {
        this.emitter.emit('cellClick', row * this.rowSize + column, mode);
    }

    _handleMouseDown(row, column, mode, e) {
        e = e || window.event;
        //this.setSelection(row * this.rowSize + column, row * this.rowSize + column);
        this._mouseDown = true;
        EventTarget.pauseEvent(e);
    }

    _handleMouseMove(row, column, mode, e) {
        e = e || window.event;
        if(this._mouseDown === false) {
            return;
        }
        if(this._selectMode === false) {
            this._selectionBegin = row * this.rowSize + column;
            this._selectionEnd = row * this.rowSize + column;
            this.emitter.emit('selection', this._selectionBegin, this._selectionEnd);
            this._selectMode = true;
        } else {
            this._selectionEnd = row * this.rowSize + column;
            let start = this._selectionBegin > this._selectionEnd ? this._selectionEnd : this._selectionBegin;
            let end = this._selectionBegin > this._selectionEnd ? this._selectionBegin : this._selectionEnd;
            this.emitter.emit('selection', start, end);
        }
        EventTarget.pauseEvent(e);
    }

    _handleMouseUp(e) {
        e = e || window.event;
        this._mouseDown = false;
        if(this._selectMode === false) {
            return;
        }
        this._selectMode = false;
        EventTarget.pauseEvent(e);
    }

    _initRowParams() {
        if(this.rows.length !== 0) {
            return;
        }
        this.rows.push(new HexEditorRowElement().appendTo(this));
        this.rowHeight = parseInt(this.rows[0].height, 10);
        this.rowSize = this.rows[0].size;
        this.rows[0].hide();
        this.disposables.add(this.rows[0].onClick(this._handleClick.bind(this, 0)));
        this.disposables.add(this.rows[0].onMouseDown(this._handleMouseDown.bind(this, 0)));
        this.disposables.add(this.rows[0].onMouseMove(this._handleMouseMove.bind(this, 0)));
    }

    _pushRows(count = 1) {
        let end = this.rowCount + count;
        let showEnd = (this.rows.length > end) ? end : this.rows.length;

        //show cached elements
        for(let i = this.rowCount; i < showEnd; i++) {
            this.rows[i].show().offset = this.getRowOffset(i);
        }

        //insert new elements
        for(let i = showEnd; i < end; i++) {
            this.rows[i] = new HexEditorRowElement().appendTo(this);
            this.rows[i].offset = this.getRowOffset(i);
            this.disposables.add(this.rows[i].onClick(this._handleClick.bind(this, i)));
            this.disposables.add(this.rows[i].onMouseDown(this._handleMouseDown.bind(this, i)));
            this.disposables.add(this.rows[i].onMouseMove(this._handleMouseMove.bind(this, i)));
        }
        this.rowCount = end;
    }

    _popRows(count = 1) {
        let start = this.rowCount - count;
        let end = this.rowCount;
        for(let i = start; i < end; i++) {
            this.rows[i].hidden = true;
        }
        this.rowCount = start;
    }

    //should only be called if element is attahced to dom
    layout() {
        this._initRowParams();

        let myHeight = parseInt(this.height, 10);
        let newRowCount = Math.ceil(myHeight / this.rowHeight);

        let oldRowCount = this.rowCount;

        if(newRowCount === oldRowCount) {
            return;
        } else if(newRowCount > oldRowCount) {
            this._pushRows(newRowCount - oldRowCount);
            this._selectionMap = TypedArrayUtils.Uint8ArrayResize(this._selectionMap, newRowCount * (this.rowSize * 2 - 1));
            this._dirtyMap = TypedArrayUtils.Uint8ArrayResize(this._dirtyMap, newRowCount * this.rowSize);
        } else {
            this._popRows(oldRowCount - newRowCount);
            this._selectionMap = TypedArrayUtils.Uint8ArrayResize(this._selectionMap, newRowCount * (this.rowSize * 2 - 1));
            this._dirtyMap = TypedArrayUtils.Uint8ArrayResize(this._dirtyMap, newRowCount * this.rowSize);
        }
    }

    setCell(offset, data) {
        let row = this.getRowIndex(offset);
        let column = this.getColumnIndex(offset);
        this.rows[row].hexElements[2 * column].text = HexUtils.higherNibble(data);
        this.rows[row].hexElements[2 * column + 1].text = HexUtils.lowerNibble(data);
        this.rows[row].charecterElements[column].text = CharUtils.byteToChar(data);
    }

    setData(array, mask, offset, length) {
        if(length > this.size) {
            throw new RangeError('length is greater than size');
        }
        if(offset + length > array.length) {
            throw new RangeError('array is small');
        }
        console.log('setData length = ' + length);

        let row = 0;
        let column = 0;
        let i = 0;
        for(; i < length; i++) {
            //enable
            this.rows[row].hexElements[2 * column].disabled = false;
            this.rows[row].hexElements[2 * column + 1].disabled = false;
            this.rows[row].charecterElements[column].disabled = false;
            //new
            this.rows[row].hexElements[2 * column].new = false;
            this.rows[row].hexElements[2 * column + 1].new = false;
            this.rows[row].charecterElements[column].new = false;
            //set data
            this.rows[row].hexElements[2 * column].text = HexUtils.higherNibble(array[offset + i]);
            this.rows[row].hexElements[2 * column + 1].text = HexUtils.lowerNibble(array[offset + i]);
            this.rows[row].charecterElements[column].text = CharUtils.byteToChar(array[offset + i]);
            //dirty
            if(mask[i]) {
                this.setDirty(i, true);
            } else {
                this.setDirty(i, false);
            }
            //next
            column++;
            if(column === 16) {
                row++;
                column = 0;
            }
        }
        if(i < this.size) {
            //enable
            this.rows[row].hexElements[2 * column].disabled = false;
            this.rows[row].hexElements[2 * column + 1].disabled = false;
            this.rows[row].charecterElements[column].disabled = false;
            //new
            this.rows[row].hexElements[2 * column].new = true;
            this.rows[row].hexElements[2 * column + 1].new = true;
            this.rows[row].charecterElements[column].new = true;
            //set data
            this.rows[row].hexElements[2 * column].text = '+';
            this.rows[row].hexElements[2 * column + 1].text = ' ';
            this.rows[row].charecterElements[column].text = '+';
            //dirty
            this.setDirty(i, false);
            //next
            column++;
            if(column === 16) {
                row++;
                column = 0;
            }
            i++;
        }
        for(; i < this.size; i++) {
            //disable
            this.rows[row].hexElements[2 * column].disabled = true;
            this.rows[row].hexElements[2 * column + 1].disabled = true;
            this.rows[row].charecterElements[column].disabled = true;
            //new
            this.rows[row].hexElements[2 * column].new = false;
            this.rows[row].hexElements[2 * column + 1].new = false;
            this.rows[row].charecterElements[column].new = false;
            //clear
            this.rows[row].hexElements[2 * column].text = ' ';
            this.rows[row].hexElements[2 * column + 1].text = ' ';
            this.rows[row].charecterElements[column].text = ' ';
            //dirty
            this.setDirty(i, false);
            //next
            column++;
            if(column === 16) {
                row++;
                column = 0;
            }
        }
        this.dataLength = length;
    }

    setDirty(offset, flag) {
        if(offset > this.size) {
            throw new RangeError('length + offset is greater than size');
        }
        let row = this.getRowIndex(offset);
        let column = this.getColumnIndex(offset);
        this.rows[row].hexElements[2 * column].dirty = flag;
        this.rows[row].hexElements[2 * column + 1].dirty = flag;
        this.rows[row].charecterElements[column].dirty = flag;
    }

    clearDirty() {
        for(let i = 0; i < this.rowCount; i++) {
            for(let j = 0; j < 16; j++) {
                if(this._dirtyMap[i * 16 + j] === 1) {
                    this.rows[i].hexElements[2 * j].dirty = false;
                    this.rows[i].hexElements[2 * j + 1].dirty = false;
                    this.rows[i].charecterElements[j].dirty = false;
                    this._dirtyMap[i * 16 + j] = 0;
                }
            }
        }
    }

    setCursor(offset, mode) {
        if(offset === this._cursorOffset && mode === this._cursorMode) {
            return;
        }
        if(offset > this.dataLength) {
            throw new RangeError('index out of range');
        }

        let row = this.getRowIndex(offset);
        let column = this.getColumnIndex(offset);

        if(offset !== -1 && this.rows[row].charecterElements[column].disabled === true) {
            return;
        }

        if(this._cursorOffset !== -1) {
            let prevRow = this.getRowIndex(this._cursorOffset);
            this.rows[prevRow].clearFocus();
        }

        if(offset !== -1) {
            this.rows[row].setFocus(column, mode);
        }

        this._cursorOffset = offset;
        this._cursorMode = mode;
    }

    setSelection(start, end) {
        if(start > this.size) {
            throw new RangeError('start is greater than size');
        }
        if(end > this.length) {
            throw new RangeError('end is greater than size');
        }

        this._clearSelection();
        if(start !== -1) {
            this._calculateSelectionMap(start, end);
            this._drawSelection();
        }
    }

    _clearSelection() {
        for(let i = 0; i < this.rowCount; i++) {
            for(let j = 0; j < (16 + 15); j++) {
                if((this._selectionMap[i * (16 + 15) + j] & SELECTED) === SELECTED) {
                    if(j === 15) {
                        //group separator selection
                        this.rows[i].hexSpacingElements[7].selected = false;
                        this.rows[i].textGroupSeparatorElement.selected = false;
                        //group separator border
                        this.rows[i].hexSpacingElements[7].removeClass(selectionBorderClasssMap2[this._selectionMap[i * (16 + 15) + j] & BORDER_ALL]);
                        this.rows[i].textGroupSeparatorElement.removeClass(selectionBorderClasssMap2[this._selectionMap[i * (16 + 15) + j] & BORDER_ALL]);
                        continue;
                    }
                    if((j & 1) === 0) {
                        //hex and character selection
                        this.rows[i].hexElements[j].selected = false;
                        this.rows[i].hexElements[j + 1].selected = false;
                        this.rows[i].charecterElements[j >> 1].selected = false;
                        //hex and character border
                        this.rows[i].hexElements[j].removeClass(selectionBorderClasssMap0[this._selectionMap[i * (16 + 15) + j] & BORDER_ALL]);
                        this.rows[i].hexElements[j + 1].removeClass(selectionBorderClasssMap1[this._selectionMap[i * (16 + 15) + j] & BORDER_ALL]);
                        this.rows[i].charecterElements[j >> 1].removeClass(selectionBorderClasssMap2[this._selectionMap[i * (16 + 15) + j] & BORDER_ALL]);
                        continue;
                    }
                    //hex separator selection
                    this.rows[i].hexSpacingElements[j >> 1].selected = false;
                    //hex separator border
                    this.rows[i].hexSpacingElements[j >> 1].removeClass(selectionBorderClasssMap2[this._selectionMap[i * (16 + 15) + j] & BORDER_ALL]);
                }
            }
        }
    }

    _drawSelection() {
        for(let i = 0; i < this.rowCount; i++) {
            for(let j = 0; j < (16 + 15); j++) {
                if((this._selectionMap[i * (16 + 15) + j] & SELECTED) === SELECTED) {
                    if(j === 15) {
                        //group separator selection
                        this.rows[i].hexSpacingElements[7].selected = true;
                        this.rows[i].textGroupSeparatorElement.selected = true;
                        //group separator border
                        this.rows[i].hexSpacingElements[7].addClass(selectionBorderClasssMap2[this._selectionMap[i * (16 + 15) + j] & BORDER_ALL]);
                        this.rows[i].textGroupSeparatorElement.addClass(selectionBorderClasssMap2[this._selectionMap[i * (16 + 15) + j] & BORDER_ALL]);
                        continue;
                    }
                    if((j & 1) === 0) {
                        //hex and character selection
                        this.rows[i].hexElements[j].selected = true;
                        this.rows[i].hexElements[j + 1].selected = true;
                        this.rows[i].charecterElements[j >> 1].selected = true;
                        //hex and character border
                        this.rows[i].hexElements[j].addClass(selectionBorderClasssMap0[this._selectionMap[i * (16 + 15) + j] & BORDER_ALL]);
                        this.rows[i].hexElements[j + 1].addClass(selectionBorderClasssMap1[this._selectionMap[i * (16 + 15) + j] & BORDER_ALL]);
                        this.rows[i].charecterElements[j >> 1].addClass(selectionBorderClasssMap2[this._selectionMap[i * (16 + 15) + j] & BORDER_ALL]);
                        continue;
                    }
                    //hex separator selection
                    this.rows[i].hexSpacingElements[j >> 1].selected = true;
                    //hex separator border
                    this.rows[i].hexSpacingElements[j >> 1].addClass(selectionBorderClasssMap2[this._selectionMap[i * (16 + 15) + j] & BORDER_ALL]);
                }
            }
        }
    }

    _calculateSelectionMap(viewStart, viewEnd) {
        let startRow = this.getRowIndex(viewStart);
        let startColumn = this.getColumnIndex(viewStart);
        let endRow = this.getRowIndex(viewEnd);
        let endColumn = this.getColumnIndex(viewEnd);

        this._selectionMap.fill(SELECTED | BORDER_ALL);
        this._selectionMap.fill(0, 0, startRow * (16 + 15) + startColumn * 2);
        this._selectionMap.fill(0, endRow * (16 + 15) + endColumn * 2 + 1);
        //console.log('start ' + startRow + )
        for(let i = startRow; i <= endRow; i++) {
            for(let j = 0; j < (16 + 15); j++) {
                //skip unselected
                if((this._selectionMap[i * (16 + 15) + j] & SELECTED) === 0) {
                    continue;
                }
                //merge with top
                if((i > startRow) && ((this._selectionMap[(i - 1) * (16 + 15) + j] & SELECTED) === SELECTED)) {
                    this._selectionMap[(i - 1) * (16 + 15) + j] = this._selectionMap[(i - 1) * (16 + 15) + j] & (~BORDER_BOTTOM);
                    this._selectionMap[i * (16 + 15) + j] = this._selectionMap[i * (16 + 15) + j] & (~BORDER_TOP);
                }
                //merge with left
                if((j > 0) && ((this._selectionMap[i * (16 + 15) + j - 1] & SELECTED) === SELECTED)) {
                    this._selectionMap[i * (16 + 15) + j - 1] = this._selectionMap[i * (16 + 15) + j - 1] & (~BORDER_RIGHT);
                    this._selectionMap[i * (16 + 15) + j] = this._selectionMap[i * (16 + 15) + j] & (~BORDER_LEFT);
                }
            }
        }
    }

    onViewResize(handler) {
        return this.emitter.on('viewresize', handler);
    }

    onCellClick(handler) {
        return this.emitter.on('cellClick', handler);
    }

    onSelection(handler) {
        return this.emitter.on('selection', handler);
    }

    onKeyPress(handler) {
        return this.on('keypress', handler);
    }

    dispose() {
        this.emitter.dispose();
        this.emitter = null;
        this.disposables.dispose();
        this.disposables = null;
        for(let row in this.rows) {
            row.dispose();
        }
        this.rows = null;
        super.dispose();
    }
}
