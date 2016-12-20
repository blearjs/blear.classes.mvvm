/**
 * 文件描述
 * @author ydr.me
 * @create 2016-11-12 17:25
 */


'use strict';

var array = require('blear.utils.array');

var directiveParser = require('./parsers/directive');

var compileAttrs = function (node, mvvm) {
    var attrs = array.from(node.attributes);

    array.each(attrs, function (index, attr) {
        directiveParser.attr(node, attr, mvvm);
    });
};

var compileElement = function (node, mvvm) {
    compileAttrs(node, mvvm);

    var childNodes = array.from(node.childNodes);

    array.each(childNodes, function (index, childNode) {
        compileNode(childNode, mvvm);
    });
};

var compileText = function (node, mvvm) {

};

var compileNode = function (node, mvvm) {
    switch (node.nodeType) {
        case 1:
            compileElement(node, mvvm);
            break;

        case 3:
            compileText(node, mvvm);
            break;
    }
};


module.exports = function (rootEl, mvvm) {
    compileNode(rootEl, mvvm);
};

