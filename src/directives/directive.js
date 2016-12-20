/**
 * 指定包装器
 * @author ydr.me
 * @created 2016-12-20 22:31
 */


'use strict';

var fun = require('blear.utils.function');

module.exports = function (directive) {
    return {
        install: function () {
            return fun.noop(directive.install || directive.bind).apply(this, arguments);
        },

        bind: function () {
            return fun.noop(directive.bind || directive.update).apply(this, arguments);
        },

        update: function () {
            return fun.noop(directive.update).apply(this, arguments);
        },

        destroy: function () {
            return fun.noop(directive.destroy).apply(this, arguments);
        }
    };
};
