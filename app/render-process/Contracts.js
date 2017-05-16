'use strict';

function _makeProxyFunction(name) {
    return function() {
        return this.actual[name].apply(this.actual, arguments);
    };
}

function _makeProxyClass(fn) {
    let constructor = function(actual) {
        this.actual = actual;
    };
    let prototype = Object.create(fn.prototype);
    constructor.prototype = prototype;
    return constructor;
}

export default class Contracts {
    constructor() {
        throw 'Cannot instanciate static class';
    }

    static define(iface) {
        if(typeof iface !== 'function') {
            throw new TypeError('Invalid function');
        }
        if(!(iface.prototype instanceof Object)) {
            throw new TypeError('Contracts cannot inherit');
        }
        let proto = iface.prototype;
        let props = Object.getOwnPropertyNames(proto);
        let proxy = _makeProxyClass(iface);
        let funcs = [];
        for(let i=0; i<props.length; i++) {
            if(typeof proto[props[i]] === 'function') {
                proxy.prototype[props[i]] = _makeProxyFunction(props[i]);
                funcs.push(props[i]);
            }
        }
        proxy.classKey = 'c_' + iface.name;
        proxy.instanceKey = 'i_' + iface.name;
        proxy.functions = funcs;
        iface.Proxy = proxy;
        iface.from = function(who) {
            return Contracts.get(who, iface);
        };
        iface.isImplementedBy = function(who) {
            return Contracts.isImplementedBy(who, iface);
        };
    }

    static implement(who, what) {
        if(typeof who !== 'function') {
            throw new TypeError('Invalid function who');
        }
        if(typeof what !== 'function') {
            throw new TypeError('Invalid function what');
        }
        if(typeof what.Proxy === 'undefined') {
            throw new TypeError('Invalid contract');
        }
        let funcs = what.Proxy.functions;
        for(let i = 0; i < funcs.length; i++) {
            if(typeof who.prototype[funcs[i]] === 'undefined') {
                throw new TypeError('Unimpemented function ' + funcs[i]);
            }
        }
        who.prototype[what.Proxy.classKey] = true;
    }

    static isImplementedBy(who, what) {
        return (who instanceof what) || (who[what.Proxy.classKey] === true) || (typeof who.prototype !== 'undefined' && [what.Proxy.classKey] === true);
    }

    static init(obj, what) {
        if(obj[what.Proxy.instanceKey] !== 'undefined') {
            obj[what.Proxy.instanceKey] = new what.Proxy(obj);
        }
    }

    static get(obj, what) {
        Contracts.init(obj, what);
        return obj[what.Proxy.instanceKey];
    }
}
