/**
 * ViewModel 类
 * @author ydr.me
 * @created 2016-12-27 15:47
 */


'use strict';

var Class = require('blear.classes.class');
var random = require('blear.utils.random');

var compile = require('../runtime/compile');
var monitor = require('../runtime/monitor');
var parser = require('../runtime/parser');

var ViewModel = Class.extend({
    className: 'ViewModel',
    constructor: function (el, scope) {
        var the = this;

        the.guid = random.guid();
        the.el = el;
        the.scope = scope;
        the.parent = null;
        the.parser = parser;
        the.children = [];
        the.directives = [];
        compile(el, scope, the);
        monitor.start(this.directives);
    },


    /**
     * 在当前 VM 上添加指令
     * @param directive
     */
    add: function (directive) {
        this.directives.push(directive);
        monitor.add(directive);
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

        parentVM.children.push(childVM);
        childVM.parent = parentVM;

        return childVM;
    }
});

module.exports = ViewModel;

