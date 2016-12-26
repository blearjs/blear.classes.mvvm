/**
 * 指定包装器
 * @author ydr.me
 * @created 2016-12-20 22:31
 */


'use strict';

var fun = require('blear.utils.function');
var typeis = require('blear.utils.typeis');
var random = require('blear.utils.random');
var array = require('blear.utils.array');


module.exports = function (directive) {
    return function () {
        return {
            guid: random.guid(),
            children: [],
            parent: null,
            aborted: directive.aborted || false,
            inited: false,
            bound: false,
            updated: false,
            destroyed: false,

            parse: function () {
                if (typeis.Function(directive.parse)) {
                    return directive.parse.call(this, arguments);
                }
            },

            init: function (node) {
                var the = this;
                fun.noop(directive.init).apply(the, arguments);
                the.inited = true;
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
                // array.each(the.watchers, function (index, watcher) {
                //     watcher.destroy();
                // });
                the.watcher.destroy();
                the.watcher = the.children = the.parent = null;
                the.destroyed = true;
            }
        };
    };
};
