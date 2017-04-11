/*jshint bitwise: false*/
import HexEditorElement from './HexEditorElement';
import HTMLElement from './HTMLElement';
import DisposableCollection from './DisposableCollection';
import EventTarget from './EventTarget';
import HexUtils from './HexUtils';

export default class HexEditorComponent {

    constructor(parentElement) {

        if(!(parentElement instanceof HTMLElement)) {
            throw new TypeError('parentElement type error');
        }

        this.windowEventTarget = new EventTarget(window);
        this.disposables = new DisposableCollection();
        this.editorSubs = null;

        this.parentElement = parentElement;

        this.hexEditorElement = new HexEditorElement();
        this.hexEditorElement.appendTo(parentElement);

        this.hexEditorViewElement = this.hexEditorElement.view;

        this.viewData = null;

        this.disposables.add(this.windowEventTarget.on('resize', this._handleWindowResize.bind(this)));
        this.disposables.add(this.hexEditorElement.onScroll(this._handleOnScroll.bind(this)));
        this.disposables.add(this.hexEditorElement.onViewSize(this._handleOnViewSize.bind(this)));
        this.disposables.add(this.hexEditorViewElement.onCellClick(this._handleOnCellClick.bind(this)));
        this.disposables.add(this.hexEditorViewElement.onSelection(this._handleOnSelection.bind(this)));
        this.disposables.add(this.windowEventTarget.on('keypress', this._handleOnKeyPress.bind(this)));

        this.hexEditorElement.layout();

        this.hexEditor = null;
    }

    setOffsetAndData(offset, data, modificationMask) {
        //data
        //let array = new Uint8Array(data);
        this.viewData = data;
        this.hexEditorViewElement.offset = offset;
        this.hexEditorViewElement.setData(data, modificationMask, 0, data.length);
        let cursorOffset = this.hexEditor.cursor.offset;
        //cursor
        let viewEnd = offset + data.length;
        if(cursorOffset >= offset && cursorOffset - offset < this.hexEditorViewElement.size && cursorOffset <= viewEnd) {
            this.hexEditorViewElement.setCursor(cursorOffset - offset, this.hexEditor.cursor.mode);
        } else {
            this.hexEditorViewElement.setCursor(-1, 0);
        }
        //selection
        let start = this.hexEditor.selection.start - offset;
        let end = this.hexEditor.selection.end - offset;
        if(end < 0 || start >= this.hexEditorViewElement.dataLength) {
            this.hexEditorViewElement.setSelection(-1, -1);
        } else {
            if(start < 0) {
                start = 0;
            }
            if(end >= this.hexEditorViewElement.dataLength) {
                end = this.hexEditorViewElement.dataLength - 1;
            }
            this.hexEditorViewElement.setSelection(start, end);
        }
    }

    loadData() {
        this.hexEditor.byteBuffer.read(this.hexEditor.offset, this.hexEditorViewElement.size).then((data) => {
            let mask = this.hexEditor.byteBuffer.readModificationArray(this.hexEditor.offset, this.hexEditorViewElement.size);
            this.setOffsetAndData(this.hexEditor.offset, data, mask);
        });
    }

    initialLoadFile() {
        this.hexEditorElement.reset();
        this.hexEditorElement.scrollHeight = Math.ceil((this.hexEditor.byteBuffer.size + 16 + 1) / this.hexEditorViewElement.rowSize);
        console.log('initialFile Load ' + this.hexEditor.offset / 16);
        this.hexEditorElement.layout();
        this.hexEditorElement.scrollTop = this.hexEditor.offset / 16;
        this.loadData();
    }

    setEditor(hexEditor) {
        if(this.hexEditor) {
            this.editorSubs.dispose();
            this.editorSubs = null;
        }
        this.editorSubs = new DisposableCollection();
        this.hexEditor = hexEditor;
        console.log('attachOnOffset');
        this.editorSubs.add(this.hexEditor.onOffsetChange(this._handleOnOffset.bind(this)));
        this.editorSubs.add(this.hexEditor.cursor.onCursorChange(this._handleOnCursorChange.bind(this)));
        this.editorSubs.add(this.hexEditor.selection.onSelectionChange(this._handleOnSelectionChange.bind(this)));
        this.editorSubs.add(this.hexEditor.byteBuffer.onModify(this._handleOnModify.bind(this)));
        this.initialLoadFile();
    }

    _handleOnCellClick(offset, mode) {
        if(this.hexEditor) {
            this.hexEditor.cursor.setCursor(this.hexEditor.offset + offset, mode);
        }
    }

    _handleOnSelection(start, end) {
        if(this.hexEditor) {
            this.hexEditor.selection.setSelection(this.hexEditor.offset + start, this.hexEditor.offset + end);
        }
    }

    _handleOnModify(offset, size) {
        this.loadData();
    }

    _handleOnKeyPress(e) {

        if(this.hexEditor) {
            if(this.viewData === null) {
                return;
            }
            let cursorOffset = this.hexEditor.cursor.offset;
            let viewEnd = this.hexEditor.offset + this.viewData.length;
            if(cursorOffset >= this.hexEditor.offset && cursorOffset < viewEnd) {
                let offset = cursorOffset;
                if(this.hexEditor.cursor.mode === 0) {
                    if(!HexUtils.isHexChar(e.charCode)) {
                        return;
                    }
                    this.viewData[cursorOffset - this.hexEditor.offset] &= 0x0F;
                    this.viewData[cursorOffset - this.hexEditor.offset] |= HexUtils.charCodeToHexCode(e.charCode) << 4;
                    //this.hexEditorViewElement.setCell(cursorOffset - this.hexEditor.offset, this.viewData[cursorOffset - this.hexEditor.offset]);
                    //this.hexEditorViewElement.setDirty(cursorOffset - this.hexEditor.offset);
                    this.hexEditor.cursor.setCursor(this.hexEditor.cursor.offset, 1);
                } else if(this.hexEditor.cursor.mode === 1) {
                    if(!HexUtils.isHexChar(e.charCode)) {
                        return;
                    }
                    this.viewData[cursorOffset - this.hexEditor.offset] &= 0xF0;
                    this.viewData[cursorOffset - this.hexEditor.offset] |= HexUtils.charCodeToHexCode(e.charCode);
                    //this.hexEditorViewElement.setCell(cursorOffset - this.hexEditor.offset, this.viewData[cursorOffset - this.hexEditor.offset]);
                    //this.hexEditorViewElement.setDirty(cursorOffset - this.hexEditor.offset);
                    this.hexEditor.cursor.setCursor(this.hexEditor.cursor.offset + 1, 0);
                } else if(this.hexEditor.cursor.mode === 2) {
                    if(e.charCode < 0 || e.charCode >= 256) {
                        return;
                    }
                    this.viewData[cursorOffset - this.hexEditor.offset] = e.charCode;
                    //this.hexEditorViewElement.setCell(cursorOffset - this.hexEditor.offset, this.viewData[cursorOffset - this.hexEditor.offset]);
                    //this.hexEditorViewElement.setDirty(cursorOffset - this.hexEditor.offset);
                    this.hexEditor.cursor.setCursor(this.hexEditor.cursor.offset + 1, 2);
                }
                this.hexEditor.byteBuffer.writeByte(offset, this.viewData[cursorOffset - this.hexEditor.offset]);
            }
        }
    }

    _handleOnCursorChange(offset, mode) {
        let cursorOffset = offset - this.hexEditor.offset;
        if(cursorOffset >= 0 && cursorOffset <= this.hexEditorViewElement.dataLength) {
            this.hexEditorViewElement.setCursor(cursorOffset, mode);
        } else {
            this.hexEditorViewElement.setCursor(-1, 0);
        }
    }

    _handleOnSelectionChange(start, end) {
        start -= this.hexEditor.offset;
        end -= this.hexEditor.offset;
        if(end < 0 || start >= this.hexEditorViewElement.dataLength) {
            this.hexEditorViewElement.setSelection(-1, -1);
        } else {
            if(start < 0) {
                start = 0;
            }
            if(end >= this.hexEditorViewElement.dataLength) {
                end = this.hexEditorViewElement.dataLength - 1;
            }
            this.hexEditorViewElement.setSelection(start, end);
        }
    }

    _handleOnOffset() {
        console.log('onOffset');
        this.loadData();
    }

    _handleOnScroll(left, top) {
        if(this.hexEditor) {
            this.hexEditor.offset = top * this.hexEditorViewElement.rowSize;
        }
    }

    _handleOnViewSize() {
        if(this.hexEditor) {
            this.loadData();
        }
    }

    _handleWindowResize() {
        this.hexEditorElement.layout();
    }

    dispose() {
        if(this.hexEditor) {
            this.editorSubs.dispose();
            this.editorSubs = null;
        }
        this.disposables.dispose();
        this.disposables = null;
        this.hexEditorElement.dispose();
        this.hexEditorElement = null;
    }
}
