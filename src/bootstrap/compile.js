/**
 * 编译
 * @author ydr.me
 * @create 2016-11-12 17:25
 */


'use strict';

var array = require('blear.utils.array');
var random = require('blear.utils.random');

var compileAttrs = function (node, vm) {
    var attrs = array.from(node.attributes);
    var aborted = false;
    var parser = vm.parser;

    array.each(attrs, function (index, attr) {
        aborted = parser.attr(node, attr, vm);
    });

    return aborted;
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
    var parser = vm.parser;
    parser.text(node, vm);
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

