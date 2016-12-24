/**
 * 指定包装器
 * @author ydr.me
 * @created 2016-12-20 22:31
 */


'use strict';

var fun = require('blear.utils.function');
var random = require('blear.utils.random');
var array = require('blear.utils.array');


module.exports = function (directive) {
    return function () {
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
                // array.each(the.watchers, function (index, watcher) {
                //     watcher.destroy();
                // });
                the.watchers = null;
                the.children = null;
                the.parent = null;
                the.unbound = true;
            }
        };
    };
};
