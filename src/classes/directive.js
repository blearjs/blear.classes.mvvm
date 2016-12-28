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
    constructor: function (config) {
        var the = this;

        if (typeis.Function(config)) {
            config = {
                update: config
            };
        }

        the.guid = random.guid();
        the.aborted = config.aborted || false;
        the.inited = false;
        the.bound = false;
        the.updated = false;
        the.destroyed = false;
        the.config = config;
    },

    /**
     * 初始化指令
     */
    init: function () {
        var the = this;
        var config = the.config;

        fun.noop(config.init).apply(the, arguments);
        the.inited = true;
    },

    /**
     * 指令绑定操作
     * @param node
     * @param newVal
     */
    bind: function (node, newVal) {
        var the = this;
        var config = the.config;

        fun.noop(config.bind || config.update).apply(the, arguments);
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
        var config = the.config;

        fun.noop(config.update).apply(the, arguments);
        the.updated = true;
    },

    /**
     * 指令销毁
     */
    destroy: function () {
        var the = this;
        var config = the.config;

        the.watcher.destroy();
        fun.noop(config.destroy).apply(the, arguments);
        the.watcher = the.config = null;
        the.destroyed = true;
    }
});

