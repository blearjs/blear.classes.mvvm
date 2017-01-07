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
var Watcher = require('../watcher/index');

var compile = require('../bootstrap/compile');
var parse = require('../bootstrap/parse');
var Response = require('./response');

var ViewModel = Class.extend({
    className: 'ViewModel',
    constructor: function (el, scope, keys) {
        var the = this;

        the.guid = random.guid();
        the.el = el;
        the.keys = keys;
        the.scope = scope;
        the.parse = parse;
        the.parent = null;
        the.definitions = null;
        the.root = the;
        the.data = scope;
        the.children = [];
        the.directives = [];
        the[_instanceDefinitions] = {};
        the[_staticalDefinitions] = {};

        if (typeof DEBUG !== 'undefined' && DEBUG) {
            el.vm = the;
        }
    },

    setInstanceDefinitions: function (definitions) {
        // 实例指令定义
        this[_instanceDefinitions] = definitions;
    },

    setStaticlDefinitions: function (definitions) {
        // 实例指令定义
        this[_staticalDefinitions] = definitions;
    },

    getDefinition: function (name) {
        return this[_instanceDefinitions][name] || this[_staticalDefinitions][name];
    },

    run: function () {
        var the = this;

        // 1、数据监听
        the.watcher = new Watcher(the.scope, {
            keys: the.keys
        });

        // 2、编译 + 解析
        the.compile(the.el);
        the.done = true;

        // 3、绑定指令、确定指令更新
        array.each(the.directives, function (index, directive) {
            directive.bind();
        });
    },

    /**
     * 编译内部指令，当内部新增、或者是懒编译的
     * 内容出现时手动触发继续编译
     * @param el
     */
    compile: function (el) {
        // 编译 + 解析
        compile(el, this);
    },

    /**
     * 在当前 VM 上添加指令
     * @param directive
     */
    add: function (directive) {
        var the = this;

        directive.scope = the.scope;
        directive.vm = the;
        directive.init();
        directive.response = new Response(directive);

        if (the.done) {
            directive.bind();
        } else {
            the.directives.push(directive);
        }
    },

    /**
     * 创建子 VM
     * @param el
     * @param scope
     * @param keys
     * @returns {ViewModel}
     */
    child: function (el, scope, keys) {
        var parent = this;
        var child = new ViewModel(el, scope, keys);

        // 不保证顺序关系，如果需要维护顺序，
        // 请指令自行完成，如 for 指令
        parent.children.push(child);
        child.parent = parent;
        child.root = parent.root;
        child.data = parent.root.data;
        // 传递指令定义引用
        child[_instanceDefinitions] = parent[_instanceDefinitions];
        child[_staticalDefinitions] = parent[_staticalDefinitions];
        child.run();
        return child;
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
        the.children = the.parent
            = the.directives
            = the[_instanceDefinitions]
            = the[_staticalDefinitions]
            = the.el = the.scope
            = null;
    }
});
var _instanceDefinitions = ViewModel.sole();
var _staticalDefinitions = ViewModel.sole();


module.exports = ViewModel;
