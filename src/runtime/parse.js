/**
 * 解析
 * @author ydr.me
 * @created 2016-12-20 22:22
 */


'use strict';

var object = require('blear.utils.object');

var expressionParse = require('../parsers/expression');
var textParse = require('../parsers/text');
var directives = require('../directives/index');

var reVarible = /\{\{([^{}]+?)}}/g;

/**
 * 解析属性节点为指令信息
 * @param {Node} node
 * @param {Node} attr
 * @param {MVVM} mvvm
 * @param {Object} scope
 */
exports.attr = function (node, attr, mvvm, scope) {
    var nodeName = attr.nodeName;

    if (nodeName[0] !== '@') {
        return null;
    }

    var name = nodeName.slice(1);
    var value = attr.nodeValue;
    var directive = directives[name]();
    var desc = {
        node: node,
        attr: attr,
        expression: value
    };

    node.removeAttribute(nodeName);

    if (directive) {
        directive.scope = scope;
        directive.desc = desc;
        directive.getter = expressionParse(value);
        mvvm._directive(directive);
    }

    return directive.aborted;
};


exports.text = function (node, mvvm, scope) {
    textParse(node.textContent);
    debugger;
};
