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
    var directiveFn = directives[name];

    node.removeAttribute(nodeName);

    if (directiveFn) {
        var directive = directiveFn();
        var desc = {
            node: node,
            attr: attr,
            expression: value
        };

        directive.scope = scope;
        directive.mvvm = mvvm;
        directive.desc = desc;
        directive.getter = expressionParse(value);
        monitor.add(directive);
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


/**
 * 解析文本节点为指令信息
 * @param {Node} node
 * @param {MVVM} mvvm
 * @param {Object} scope
 */
exports.text = function (node, mvvm, scope) {
    var getter = textParse(node.textContent);
    var directive = directives.text();
    var desc = {
        node: node,
        attr: null,
        expression: null
    };
    directive.scope = scope;
    directive.mvvm = mvvm;
    directive.desc = desc;
    directive.getter = getter;
    monitor.add(directive);

    return false;
};
