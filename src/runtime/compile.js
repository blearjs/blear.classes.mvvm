/**
 * 编译
 * @author ydr.me
 * @create 2016-11-12 17:25
 */


'use strict';

var array = require('blear.utils.array');
var random = require('blear.utils.random');
var Class = require('blear.classes.class');

var parse = require('./parse');

var compileAttrs = function (node, scope, vm) {
    var attrs = array.from(node.attributes);
    var aborted = false;

    array.each(attrs, function (index, attr) {
        aborted = parse.attr(node, attr, scope, vm);
    });

    return aborted;
};

var compileElement = function (node, scope, vm) {
    // 属性指令中止遍历
    if (compileAttrs(node, scope, vm) === true) {
        return;
    }

    var childNodes = array.from(node.childNodes);

    array.each(childNodes, function (index, childNode) {
        compileNode(childNode, scope, vm);
    });
};

var compileText = function (node, scope, vm) {
    parse.text(node, scope, vm);
};

var compileNode = function (node, scope, vm) {
    switch (node.nodeType) {
        case 1:
            compileElement(node, scope, vm);
            break;

        case 3:
            compileText(node, scope, vm);
            break;
    }
};

var ViewModel = Class.extend({
    className: 'ViewModel',
    constructor: function (el, scope, parent) {
        var the = this;

        the.guid = random.guid();
        the.el = el;
        the.scope = scope;
        the.parent = parent;
        the.children = [];
        the.directives = [];
    },
    add: function (directive) {
        this.directives.push(directive);
    }
});

module.exports = function (rootEl, scope, parentVM) {
    var vm = new ViewModel(rootEl, scope, parentVM);
    compileNode(rootEl, scope, vm);
};

