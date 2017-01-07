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
var object = require('blear.utils.object');
var string = require('blear.utils.string');
var array = require('blear.utils.array');
var access = require('blear.utils.access');

var definitionMap = require('../directives/index');

var Directive = Class.extend({
    className: 'Directive',
    constructor: function (category, name, definition) {
        var the = this;
        var args = access.args(arguments);

        // 虚拟指令
        if (args.length === 1) {
            definition = args[0];
            category = 'virtual';
            name = random.guid();
        }

        if (typeis.Function(definition)) {
            definition = {
                update: definition
            };
        }

        object.assign(the, definition);
        // 删除 definition 带来的一些方法，
        // 转而让原型方法去实现
        delete(the.init);
        delete(the.bind);
        delete(the.update);
        delete(the.destroy);
        the.category = category;
        the.name = name;
        the.guid = random.guid();
        the.empty = definition.empty || false;
        the.stop = definition.stop || false;
        the.inited = false;
        the.bound = false;
        the.updated = false;
        the.destroyed = false;
        the.definition = definition;
        the.weight = the.weight || 1;
        the.filters = {};
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
     */
    bind: function () {
        var the = this;
        var definition = the.definition;
        var responder = the.responder;

        if (the.category === 'event') {
            return;
        }

        responder.beforeGet();
        fun.noop(definition.bind || definition.update).call(the, the.node, responder.get());
        responder.afterGet();
        the.bound = true;
    },

    /**
     * 更新指令
     * @param node
     * @param newVal
     * @param oldVal
     * @param signal
     */
    update: function (node, newVal, oldVal, signal) {
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

        the.responder.unlink();
        fun.noop(definition.destroy).apply(the, arguments);
        // 响应者
        the.responder
            // 指令定义
            = the.definition
            // 对前一个指令的引用
            = the.prev
            = the.get
            = the.set
            = null;

        if (the.refPrev) {
            // 前一个指令对自己的引用
            the.refPrev.prev = null;
        }

        the.destroyed = true;
    }
});

// Directive.DEFAULT_WEIGHT = 1;
// Directive.LOOP_WEIGHT = 10;
// Directive.CONDITION_WEIGHT = 100;

/**
 * 创建指令
 * @param category
 * @param name
 * @param vm
 * @returns {*}
 */
Directive.create = function (category, name, vm) {
    // 1、优先使用实例指令、静态指令
    var definition = vm && vm.getDefinition(name);

    if (definition) {
        return new Directive('instance', name, definition);
    }

    // 2、然后使用内置指令
    definition = definitionMap[category];

    if (!definition) {
        if (typeof DEBUG !== 'undefined' && DEBUG) {
            throw new TypeError('未找到`' + category + '`类型指令');
        }

        return;
    }

    return new Directive(category, name, definition);
};

module.exports = Directive;
