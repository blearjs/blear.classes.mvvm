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

var compile = require('../bootstrap/compile');
var monitor = require('../bootstrap/monitor');
var parser = require('../bootstrap/parser');

var vmList = [];
var ViewModel = Class.extend({
    className: 'ViewModel',
    constructor: function (el, scope) {
        var the = this;

        the.guid = random.guid();
        the.el = el;
        the.scope = scope;
        the.data = scope;
        the.root = the;
        the.parent = null;
        the.parser = parser;
        the.monitor = monitor;
        the.children = [];
        the.directives = [];
        compile(el, scope, the);
        monitor.start(the.directives);
        vmList.push(the);
    },


    /**
     * 在当前 VM 上添加指令
     * @param directive
     */
    add: function (directive) {
        var the = this;

        the.directives.push(directive);
        monitor.add(directive, the.scope);

        if (typeof DEBUG !== 'undefined' && DEBUG) {
            directive.node.directives = directive.node.directives || [];
            directive.node.directives.push(directive);
            the.el.vm = the;
        }
    },

    /**
     * 创建子 VM
     * @param el
     * @param scope
     * @returns {*}
     */
    child: function (el, scope) {
        var parentVM = this;
        var childVM = new ViewModel(el, scope);

        // 不保证顺序关系，如果需要维护顺序，
        // 请指令自行完成，如 for 指令
        parentVM.children.push(childVM);
        childVM.parent = parentVM;
        childVM.root = parentVM.root;

        return childVM;
    },

    /**
     * 销毁当前 VM
     */
    destroy: function () {
        var the = this;

        // 1、销毁所有子 VM
        array.each(the.children, function (index, child) {
            child.destroy();
        });

        // 2、销毁管理的指令
        array.each(the.directives, function (index, directive) {
            directive.destroy();
        });

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
        array.delete(vmList, the);
    }
});

ViewModel.end = function () {
    array.each(vmList, function (_, vm) {
        array.each(vm.directives, function (__, directive) {
            directive.watcher.linkEnd();
        });
    });
};

module.exports = ViewModel;
