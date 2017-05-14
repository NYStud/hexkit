'use strict';

import Module from 'module';

module.exports = (function RequireHook() {
    let old = Module._load;
    Module._load = function() {
        let args = [].slice.call(arguments);
        if(args[0] === 'hexkit') {
            args[0] = './hexkit';
        }
        return old.apply(this, args);
    };
    return {};
})();
