/**
 * 指定包装器
 * @author ydr.me
 * @created 2016-12-20 22:31
 */


'use strict';

var fun = require('blear.utils.function');
var random = require('blear.utils.random');


module.exports = function (directive) {
    return function () {
        var oldVal;
        return {
            id: random.guid(),
            watchers: [],
            children: [],
            parent: null,
            aborted: directive.aborted || false,
            installed: false,
            bound: false,
            updated: false,
            unbound: false,
            init: function (node) {
                var the = this;
                fun.noop(directive.init || directive.bind).apply(the, arguments);
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

            unbind: function () {
                var the = this;
                fun.noop(directive.unbind).apply(the, arguments);
                the.unbound = true;
            },

            dispatch: function (_newVal, _oldVal, operation) {
                var the = this;
                var newVal = the.get();
                var node = the.desc.node;

                if (oldVal === newVal) {
                    return;
                }

                this.update(node, newVal, oldVal, operation);
                oldVal = newVal;
            }
        };
    };
};
