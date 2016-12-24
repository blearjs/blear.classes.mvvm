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
var monitor = require('./monitor');

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
        directive.mvvm = mvvm;
        directive.desc = desc;
        var getter = directive.getter = expressionParse(value);
        directive.get = function () {
            return getter(scope);
        };
        monitor.directives.push(directive);
        return directive.aborted;
    }

    if (typeof DEBUG !== 'undefined' && DEBUG) {
        console.error(
            '当前正在编译的指令无法解析\n' +
            'name: ' + name + '\n' +
            'value: ' + value
        );
    }
};


exports.text = function (node, mvvm, scope) {
    textParse(node.textContent);
};
