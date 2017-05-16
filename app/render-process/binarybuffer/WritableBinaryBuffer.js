import BinaryBuffer from '../BinaryBuffer';
import EventEmitter from '../EventEmitter';
import Promise from 'bluebird';
import BufferedFileReader from '../BufferedFileReader';

const MAX_ELEMENTS = 10;
const TYPE_FILE_PTR = 1;
const TYPE_BUFFER_PTR = 2;
const TYPE_PARENT = 3;

class TreeNode {
    constructor(type, parent, prev, next) {
        this.type = type;
        this.parent = parent;
        this.prev = prev;
        this.next = next;
        if(type === TYPE_PARENT) {
            this.keys = new Array(MAX_ELEMENTS);
            this.childs = new Array(MAX_ELEMENTS);
            this.count = 0;
        }
    }

    set length(len) {
        if(this.type !== TYPE_PARENT) {
            this.dataLength = len;
            return;
        }
        throw Error('cannot set length of non parent');
    }

    get length() {
        if(this.type !== TYPE_PARENT) {
            return this.dataLength;
        }
        let length = 0;
        for(let i = 0; i < this.count; i++) {
            length += this.keys[i];
        }
        return length;
    }

    updateLength(node) {
        for(let i = 0; i < this.count; i++) {
            if(this.childs[i] === node) {
                let delta =  node.length - this.keys[i];
                this.keys[i] += delta;
                if((this.parent !== null) && (delta !== 0)) {
                    this.parent.updateLength(this);
                }
            }
        }
    }

    get rootNode() {
        if(this.parent !== null) {
            return this.parent.rootNode;
        } else {
            return this;
        }
    }

    deleteNode(node) {
        let pos = 0;
        for(let i = 0; i < this.count; i++) {
            if(childs[i] === node) {
                pos = i;
            }
        }
        for(let i = pos + 1; i < this.count - 1; i++) {
            this.key[i] = this.keys[i+1];
            this.cbilds[i] = this.childs[i+1];
        }
        this.count--;
        //this.length = 0;
        //for(let i = 0; i < this.count; i++) {
        //    this.length += this.keys[i];
        //}
        this.parent.updateLength(this);
        if(this.count === 0) {
            this.parent.removeNode(this);
        }
        //update prev next
        if(node.prev !== null) {
            node.prev.next = node.next;
        }
        if(node.next !== null) {
            node.next.prev = node.prev;
        }

        return this.rootNode;
    }

    insertAfter(afterNode, node) {
        if(this.count > Math.floor(MAX_ELEMENTS/2)) {
            //split this node
            let parent = this.parent;
            if(parent === null) {
                //create parent if does not exist
                parent = new TreeNode(TYPE_PARENT, null, null, null);
                //parent.length = this.length;
                parent.keys[0] = this.length;
                parent.childs[0] = this;
                parent.count = 1;
                this.parent = parent;

            }
            let newNode = new TreeNode(TYPE_PARENT, parent, null, null);
            //let length = 0;
            let j = 0;
            for(let i = Math.floor(this.count/2); i < this.count; i++) {
                newNode.keys[j] = this.keys[i];
                this.keys[i] = 0;
                newNode.childs[j] = this.childs[i];
                this.childs[i] = null;
                newNode.childs[j].parent = newNode;
                //length += newNode.keys[j];
                j++;
            }
            //newNode.length = length;
            newNode.count =  this.count - Math.floor(this.count/2);
            this.count = Math.floor(this.count/2);
            //length = 0;
            //for(let i = 0; i < this.count; i++) {
            //    length += this.keys[i];
            //}

            parent.updateLength(this);
            parent.insertAfter(this, newNode);
            if(afterNode !== null) {
                for(let i = 0; i < newNode.count; i++) {
                    if(newNode.childs[i] === afterNode) {
                        return newNode.insertAfter(afterNode, node);
                    }
                }
            }
        }

        //insert node
        //this.length += node.length;
        let pos = 0;
        if(afterNode !== null) {
            for(let i = 0; i < this.count; i++) {
                if(this.childs[i] === afterNode) {
                    pos = i + 1;
                    break;
                }
            }
        }
        for(let i = this.count - 1; i >= pos; i--) {
            this.keys[i + 1] = this.keys[i];
            this.childs[i + 1] = this.childs[i];
        }
        this.keys[pos] = node.length;
        this.childs[pos] = node;
        this.count++;
        if(this.parent !== null) {
            this.parent.updateLength(this);
        }

        //set prev/next of node
        if(pos === 0) {
            let nextNode = this.childs[1];
            node.parent = this;
            node.next = nextNode;
            node.prev = nextNode.prev;
            if(node.prev !== null) {
                node.prev.next = node;
            }
            if(node.next !== null) {
                node.next.prev = node;
            }
        } else {
            let prevNode = this.childs[pos - 1];
            node.parent = this;
            node.prev = prevNode;
            node.next = prevNode.next;
            if(node.prev !== null) {
                node.prev.next = node;
            }
            if(node.next !== null) {
                node.next.prev = node;
            }
        }

        return this.rootNode;
    }

    getOffsetOf(node) {
        let offset = this.offset;
        for(let i = 0; i < this.count; i++) {
            if(this.childs[i] === node) {
                return offset;
            }
            offset += this.keys[i];
        }
        throw new Error('node not found');
    }

    get offset() {
        if(this.parent === null) {
            return 0;
        }
        return this.parent.getOffsetOf(this);
    }

    findNode(offset) {
        if(offset >= this.length) {
            return null;
        }
        if(offset < 0) {
            return null;
        }
        if(this.type !== TYPE_PARENT) {
            if(offset < this.length) {
                return this;
            }
            return null;
        } else {
            for(let i = 0; i < this.count; i++) {
                let ret = this.childs[i].findNode(offset);
                if(ret !== null) {
                    return ret;
                }
                offset -= this.keys[i];
            }
        }
        return null;
    }

    findNodes(offset, length) {
        let start = offset;
        let end = offset + length;
        if(end <= 0) {
            return [];
        }
        if(start >= this.length) {
            return [];
        }
        if(this.type !== TYPE_PARENT) {
            if(start >= 0) {
                return [this];
            }
            if(end <= length) {
                return [this];
            }
            return [];
        } else {
            let nodes = [];
            for(let i = 0; i < this.count; i++) {
                let ret = this.childs[i].findNodes(offset, length);
                if(ret.length !== 0) {
                    Array.prototype.push.apply(nodes, ret);
                }
                offset -= this.keys[i];
                length -= this.keys[i];
            }
            return nodes;
        }
    }
}

export default class WritableBinaryBuffer extends BinaryBuffer {

    constructor(file, fileOffset = 0, length = -1) {
        super();
        this._file = file;
        this._reader = new BufferedFileReader(file);
        let node = new TreeNode(TYPE_FILE_PTR, null, null, null);
        node.fileOffset = fileOffset;
        node.length = ((length < 0) || (length > (file.size - fileOffset))) ? (file.size - fileOffset) : length;
        let parent = new TreeNode(TYPE_PARENT, null, null, null);
        parent.keys[0] = ((length < 0) || (length > (file.size - fileOffset))) ? (file.size - fileOffset) : length;
        parent.childs[0] = node;
        parent.count = 1;
        //parent.length = node.length;
        node.parent = parent;
        this._rootNode = parent;
        this.emitter = new EventEmitter();
    }

    get size() {
        return this._rootNode.length;
    }


    insertNode(prevNode, node) {
        let p = null;
        if(prevNode === null) {
            let p = null;
            let n = this._rootNode;
            while(n.count > 0) {
                p = n;
                n = n.childs[0];
            }
        } else {
            p = prevNode.parent;
        }
        this._rootNode = p.insertAfter(prevNode, node);
    }

    deleteNode(node) {
        this._rootNode = node.parent.deleteNode(node);
    }

    splitNode(nodeToSplit, offset) {
        let newNode = null;
        if(nodeToSplit.type === TYPE_FILE_PTR) {
            newNode = new TreeNode(TYPE_FILE_PTR, null, null, null);
            newNode.fileOffset = nodeToSplit.fileOffset + offset;
        } else {
            newNode = new TreeNode(TYPE_BUFFER_PTR, null, null, null);
            let buffer = nodeToSplit.buffer;
            let buffer1 = buffer.slice(0, offset);
            let buffer2 = buffer.slice(offset);
            let view1 = new Uint8Array(buffer1);
            let view2 = new Uint8Array(buffer2);
            nodeToSplit.buffer = buffer1;
            nodeToSplit.view = view1;
            newNode.buffer = buffer2;
            newNode.view = view2;
        }
        newNode.length = nodeToSplit.length - offset;
        let delta = nodeToSplit.length - offset;
        let node = nodeToSplit;
        node.length = offset;
        node.parent.updateLength(node);
        this.insertNode(nodeToSplit, newNode);
    }

    read(offset, size) {
        let nodes = this._rootNode.findNodes(offset, size);
        let promises = [];
        if(offset + size > this.size) {
            size = this.size - offset;
        }
        let buffer = new Buffer(size);
        let view = new Uint8Array(buffer);
        let self = this;
        return new Promise((resolve, reject) => {
            let node = nodes[0];
            let nodeOffset = offset - node.offset;
            for(let index = 0; index < size; index++) {
                if(nodeOffset === node.length) {
                    node = node.next;
                    nodeOffset = 0;
                }
                if(node.type === TYPE_FILE_PTR) {
                    (function (node, nodeOffset) {
                        promises.push(self._reader.readByte(node.fileOffset + nodeOffset).then(function (byte) {
                            view[index] = byte;
                        }));
                    }(node, nodeOffset));
                    nodeOffset++;
                } else {
                    view[index] = node.view[nodeOffset];
                    nodeOffset++;
                }
            }
            Promise.all(promises).then(function() {
                resolve(view);
            });
        });
    }

    isByteModified(offset) {
        let node = this._rootNode.findNode(offset);
        return node.type === TYPE_BUFFER_PTR;
    }

    readModificationArray(offset, size) {
        let nodes = this._rootNode.findNodes(offset, size);
        let mask = new Array(size);
        if(offset + size > this.size) {
            size = this.size - offset;
        }
        let buffer = new Buffer(size);
        let view = new Uint8Array(buffer);
        let self = this;
        let node = nodes[0];
        let nodeOffset = offset - node.offset;
        for(let index = 0; index < size; index++) {
            if(nodeOffset === node.length) {
                node = node.next;
                nodeOffset = 0;
            }
            if(node.type === TYPE_FILE_PTR) {
                mask[index] = false;
                nodeOffset++;
            } else {
                mask[index] = true;
                nodeOffset++;
            }
        }
        return mask;
    }

    readByte(offset) {
        let node = this._rootNode.findNode(offset);
        let nodeOffset = offset - node.offset;
        return new Promise((resolve, reject) => {
            if(node.type === TYPE_FILE_PTR) {
                return this._reader.readByte(node.fileOffset + nodeOffset).then(function (byte) {
                    resolve(byte);
                });
            } else {
                resolve(node.view[nodeOffset]);
            }
        });

    }

    writeByte(offset, byte) {
        let node = this._rootNode.findNode(offset);
        let nodeOffset = node.offset;
        if(nodeOffset !== offset) {
            this.splitNode(node, offset - nodeOffset);
            node = node.next;
        }
        nodeOffset = node.offset;
        if(node.length !== 1) {
            this.splitNode(node, 1);
        }
        node.type = TYPE_BUFFER_PTR;
        node.buffer = new ArrayBuffer(1);
        node.view = new Uint8Array(node.buffer);
        node.view[0] = byte;
        this.emitter.emit('modify', offset, 1);
    }

    deleteBytes(offset, size) {
        let nodes = this._rootNode.findNodes(offset, size);
        let node = nodes[0];
        let nodeOffset = node.offset;
        if(offset !== node.offset) {
            this.splitNode(node, offset - nodeOffset);
        }
        node = nodes[nodes.length - 1];
        if(offset + size !== node.offset + node.length) {
            this.splitNode(node, offset + size - node.offset);
        }
        nodes = this._rootNode.findNodes(offset, size);
        let prevNode = nodes[0].prev;
        for(let i = 0; i < nodes.length; i++) {
            this.deleteNode(nodes[i]);
        }
        this.emitter.emit('modify', offset, -1);
        this.emitter.emit('size', this.size);
    }

    insertByte(offset, byte) {
        let node = this._rootNode.findNode(offset);
        let nodeOffset = node.offset;
        if(nodeOffset !== offset) {
            this.splitNode(node, offset - nodeOffset);
        }
        let newNode = new TreeNode(TYPE_BUFFER_PTR, null, null, null);
        newNode.buffer = new ArrayBuffer(1);
        newNode.view = new Uint8Array(node.buffer);
        newNode.view[0] = byte;
        this.insertAfter(node, newNode);
        this.emitter.emit('modify', offset, -1);
        this.emitter.emit('size', this.size);
    }

    write(offset, size, data) {
        let nodes = this._rootNode.findNodes(offset, size);
        let node = nodes[0];
        let nodeOffset = node.offset;
        if(offset !== node.offset) {
            this.splitNode(node, offset - nodeOffset);
        }
        node = nodes[nodes.length - 1];
        if(offset + size !== node.offset + node.length) {
            this.splitNode(node, offset + size - node.offset);
        }
        nodes = this._rootNode.findNodes(offset, size);
        let prevNode = nodes[0].prev;
        for(let i = 0; i < nodes.length; i++) {
            this.deleteNode(nodes[i]);
        }
        let newNode = new TreeNode(TYPE_BUFFER_PTR, null, null, null);
        newNode.buffer = new ArrayBuffer(size);
        newNode.view = new Uint8Array(node.buffer);
        for(let i = 0; i < size; i++) {
            newNode.view[i] = data[i];
        }
        this.insertAfter(node, newNode);
        this.emitter.emit('modify', offset, size);
    }

    insert(offset, size, data) {
        let node = this._rootNode.findNode(offset);
        let nodeOffset = node.offset;
        if(nodeOffset !== offset) {
            this.splitNode(node, offset - nodeOffset);
        }
        let newNode = new TreeNode(TYPE_BUFFER_PTR, null, null, null);
        newNode.buffer = new ArrayBuffer(size);
        newNode.view = new Uint8Array(node.buffer);
        for(let i = 0; i < size; i++) {
            newNode.view[i] = data[i];
        }
        this.insertAfter(node, newNode);
        this.emitter.emit('modify', offset, -1);
        this.emitter.emit('size',  this.size);
    }

    onModify(handler) {
        return this.emitter.on('modify', handler);
    }

    onSize(handler) {
        return this.emitter.on('size', handler);
    }

    dispose() {
        this.emitter.dispose();
        this.emitter =  null;
    }
}
