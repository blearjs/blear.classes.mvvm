/**
 * ViewModel 类
 * @author ydr.me
 * @created 2016-12-27 15:47
 */


'use strict';

var Class = require('blear.classes.class');
var random = require('blear.utils.random');
var array = require('blear.utils.array');
var modification = require('blear.core.modification');
var Watcher = require('../watcher');

var compile = require('../bootstrap/compile');
var monitor = require('../bootstrap/monitor');
var parser = require('../bootstrap/parser');
var Response = require('./response');
var expParser = require('../parsers/expression');

var ViewModel = Class.extend({
    className: 'ViewModel',
    constructor: function (el, scope, keys, parent) {
        var the = this;

        the.guid = random.guid();
        the.el = el;
        the.scope = scope;
        the.monitor = monitor;
        the.parser = parser;
        the.children = [];
        the.directives = [];

        if (parent) {
            // 不保证顺序关系，如果需要维护顺序，
            // 请指令自行完成，如 for 指令
            parent.children.push(the);
            the.parent = parent;
            the.root = parent.root;
            the.data = parent.root.data;
            the.watcher = new Watcher(scope, {
                keys: keys
            });
        } else {
            the.parent = null;
            the.root = the;
            the.data = scope;
            the.watcher = new Watcher(scope);
        }

        // 1、编译 + 解析
        compile(el, the);

        // 2、绑定指令、确定指令更新
        the.directives.sort(function (a, b) {
            return a.weight - b.weight;
        });
        array.each(the.directives, function (index, directive) {
            the[_execDirective](directive);
        });

        the.done = true;
    },

    /**
     * 在当前 VM 上添加指令
     * @param directive
     */
    add: function (directive) {
        var the = this;

        if (the.done) {
            directive.init();
            directive.response = new Response();
            var getter = directive.getter = expParser(directive.exp);
            var scope = directive.scope = the.scope;
            directive.get = function () {
                return getter(scope);
            };
            the[_execDirective](directive);
        } else {
            the.directives.push(directive);
        }
    },

    /**
     * 创建子 VM
     * @param el
     * @param scope
     * @param keys
     * @returns {*}
     */
    child: function (el, scope, keys) {
        return new ViewModel(el, scope, keys, this);
    },

    /**
     * 销毁当前 VM
     */
    destroy: function () {
        var the = this;

        // 1、销毁管理的指令
        array.each(the.directives, function (index, directive) {
            directive.destroy();
        });

        // 2、销毁所有子 VM
        // 这里必须使用 while 操作，因为 child 销毁的时候，
        // 会对父级的 children 对象进行取消引用（删除数组项）
        // 这样就会在 each 的时候，发现 child 是 undefined
        var child;
        while (( child = the.children.pop())) {
            child.destroy();
        }

        // 3、删除 DOM 节点
        modification.remove(the.el);

        // 4、删除父级对当前的引用
        var foundIndex = -1;
        array.each(the.parent.children, function (index, child) {
            if (child === the) {
                foundIndex = index;
                return false;
            }
        });
        the.parent.children.splice(foundIndex, 1);

        // 5、删除当前引用
        the.children = the.parent = the.parser
            = the.monitor = the.directives
            = the.el = the.scope
            = null;
    }
});
var _execDirective = ViewModel.sole();
var pro = ViewModel.prototype;

/**
 * 执行指令
 * @param directive
 */
pro[_execDirective] = function (directive) {
    var scope = directive.scope;
    var getter = directive.getter;
    var node = directive.node;
    var oldVal;

    if (getter) {
        // 一次性绑定
        if (!directive.filters.once) {
            var response = directive.response;
            response.respond = function (operation) {
                // 新值使用表达式计算
                var newVal = directive.get();
                directive.update(node, newVal, oldVal, operation);
                oldVal = newVal;
            };
            // 不能省略
            Watcher.response = response;
        }

        // 第一次取值时传递 response
        oldVal = getter(scope);
        Watcher.response = null;
    }

    directive.bind(node, oldVal);
};

ViewModel.end = function () {
    // array.each(vmList, function (_, vm) {
    //     array.each(vm.directives, function (__, directive) {
    //         directive.watcher.linkEnd();
    //     });
    // });
};

module.exports = ViewModel;
