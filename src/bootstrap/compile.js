/**
 * 编译
 * @author ydr.me
 * @create 2016-11-12 17:25
 */


'use strict';

var array = require('blear.utils.array');
var random = require('blear.utils.random');

var compileAttrs = function (node, scope, vm) {
    var attrs = array.from(node.attributes);
    var aborted = false;
    var parser = vm.parser;

    array.each(attrs, function (index, attr) {
        aborted = parser.attr(node, attr, scope, vm);
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
    var parser = vm.parser;
    parser.text(node, scope, vm);
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


module.exports = compileNode;

