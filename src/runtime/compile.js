/**
 * 编译
 * @author ydr.me
 * @create 2016-11-12 17:25
 */


'use strict';

var array = require('blear.utils.array');

var parse = require('./parse');

var compileAttrs = function (node, mvvm, scope) {
    var attrs = array.from(node.attributes);
    var aborted = false;

    array.each(attrs, function (index, attr) {
        aborted = parse.attr(node, attr, mvvm, scope);
    });

    return aborted;
};

var compileElement = function (node, mvvm, scope) {
    // 属性指令中止遍历
    if (compileAttrs(node, mvvm, scope) === true) {
        return;
    }

    var childNodes = array.from(node.childNodes);

    array.each(childNodes, function (index, childNode) {
        compileNode(childNode, mvvm, scope);
    });
};

var compileText = function (node, mvvm, scope) {
    parse.text(node, mvvm, scope);
};

var compileNode = function (node, mvvm, scope) {
    switch (node.nodeType) {
        case 1:
        case 11:
            compileElement(node, mvvm, scope);
            break;

        case 3:
            compileText(node, mvvm, scope);
            break;
    }
};

module.exports = function (rootEl, mvvm, scope) {
    compileNode(rootEl, mvvm, scope);
};

