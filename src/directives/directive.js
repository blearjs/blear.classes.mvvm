/**
 * 指定包装器
 * @author ydr.me
 * @created 2016-12-20 22:31
 */


'use strict';

var fun = require('blear.utils.function');

module.exports = function (directive) {
    return {
        aborted: directive.aborted || false,
        installed: false,
        bound: false,
        updated: false,
        destroyed: false,
        install: function (node) {
            var the = this;
            fun.noop(directive.install || directive.bind).apply(the, arguments);
            the.installed = true;
        },

        bind: function (node, newVal) {
            var the = this;
            fun.noop(directive.bind || directive.update).apply(the, arguments);
            the.bound = true;
        },

        update: function (node, newVal, oldVal, operation) {
            var the = this;
            fun.noop(directive.update).apply(the, arguments);
            the.updated = true;
        },

        destroy: function () {
            var the = this;
            fun.noop(directive.destroy).apply(the, arguments);
            the.destroyed = true;
        }
    };
};
