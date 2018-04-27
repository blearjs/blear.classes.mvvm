/**
 * 编译
 * @author ydr.me
 * @create 2016-11-12 17:25
 */


'use strict';

var array = require('blear.utils.array');
// var random = require('blear.utils.random');

var parse = require('./parse');

var compileAttrs = function (node, vm) {
    var attrs = array.from(node.attributes);
    var directives = [];

    // 1、遍历节点属性
    array.each(attrs, function (index, attr) {
        var directive = parse.attr(vm, node, attr);

        if (!directive) {
            return;
        }

        directives.push(directive);
    });

    // 2、按权重进行指令排序
    directives.sort(function (a, b) {
        return b.weight - a.weight;
    });

    var stop = false;

    // 3、依次添加 directive，可被中断
    array.each(directives, function (index, directive) {
        node.removeAttribute(directive.attr);
        vm.add(directive);

        if (directive.stop) {
            stop = true;
            return false;
        }
    });

    return stop;
};

var compileElement = function (node, vm) {
    // 属性指令中止遍历
    if (compileAttrs(node, vm) === true) {
        return;
    }

    var childNodes = array.from(node.childNodes);

    array.each(childNodes, function (index, childNode) {
        compileNode(childNode, vm);
    });
};

var compileText = function (node, vm) {
    var directives = parse.text(vm, node);

    array.each(directives, function (index, directive) {
        vm.add(directive);
    });
};

var compileNode = function (node, vm) {
    switch (node.nodeType) {
        case 1:
            compileElement(node, vm);
            break;

        case 3:
            compileText(node, vm);
            break;
    }
};


module.exports = compileNode;

