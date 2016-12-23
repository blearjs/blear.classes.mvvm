/**
 * 文件描述
 * @author ydr.me
 * @created 2016-12-20 22:22
 */


'use strict';

var object = require('blear.utils.object');

var expression = require('../utils/expression');
var monitor = require('../utils/monitor');

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
    var directive = mvvm._directive(name)();
    var getter = expression.parse(value);
    var director = {
        mvvm: mvvm,
        node: node,
        attr: attr,
        // name: name,
        // value: value,
        expression: value,
        scope: scope
    };
    var oldVal;

    node.removeAttribute(nodeName);

    if (directive) {
        directive.director = director;
        // directive.mvvm = mvvm;
        directive.install(node);
        monitor.directive = directive;
        directive.bind(node, getter(scope));
        directive.dispatch = function (_newVal, _oldVal, operation) {
            var newVal = getter(scope);

            if(oldVal === newVal) {
                return;
            }

            directive.update(node, newVal, oldVal, operation);
            oldVal = newVal;
        };
    }

    return directive.aborted;
};


