/**
 * 指令类
 * @author ydr.me
 * @created 2016-12-27 15:49
 */


'use strict';

var Class = require('blear.classes.class');
var random = require('blear.utils.random');
var fun = require('blear.utils.function');
var typeis = require('blear.utils.typeis');

module.exports = Class.extend({
    className: 'Directive',
    constructor: function (definition) {
        var the = this;

        if (typeis.Function(definition)) {
            definition = {
                update: definition
            };
        }

        the.guid = random.guid();
        the.aborted = definition.aborted || false;
        the.inited = false;
        the.bound = false;
        the.updated = false;
        the.destroyed = false;
        the.definition = definition;
    },

    /**
     * 初始化指令
     */
    init: function () {
        var the = this;
        var definition = the.definition;

        fun.noop(definition.init).apply(the, arguments);
        the.inited = true;
    },

    /**
     * 指令绑定操作
     * @param node
     * @param newVal
     */
    bind: function (node, newVal) {
        var the = this;
        var definition = the.definition;

        fun.noop(definition.bind || definition.update).apply(the, arguments);
        the.bound = true;
    },

    /**
     * 更新指令
     * @param node
     * @param newVal
     * @param oldVal
     * @param operation
     */
    update: function (node, newVal, oldVal, operation) {
        var the = this;
        var definition = the.definition;

        // 如果指令被销毁了，则取消后续操作
        if (!definition) {
            return;
        }

        fun.noop(definition.update).apply(the, arguments);
        the.updated = true;
    },

    /**
     * 指令销毁
     */
    destroy: function () {
        var the = this;
        var definition = the.definition;

        the.watcher.destroy();
        fun.noop(definition.destroy).apply(the, arguments);
        the.watcher = the.definition = null;
        the.destroyed = true;
    }
});

