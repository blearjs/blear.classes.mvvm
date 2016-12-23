/**
 * 文件描述
 * @author ydr.me
 * @created 2016-12-20 22:22
 */


'use strict';

var object = require('blear.utils.object');

var expression = require('../utils/expression');

/**
 * 解析属性节点为指令信息
 * @param {Node} node
 * @param {Node} attr
 * @param {MVVM} mvvm
 * @param {Object} scope
 * @param {Watcher} watcher
 */
exports.attr = function (node, attr, mvvm, scope, watcher) {
    var nodeName = attr.nodeName;

    if (nodeName[0] !== '@') {
        return null;
    }

    var name = nodeName.slice(1);
    var value = attr.nodeValue;
    var directive = mvvm._directive(name)();
    var director = {
        mvvm: mvvm,
        node: node,
        attr: attr,
        name: name,
        value: value,
        expression: value,
        scope: scope,
        watcher: watcher,
        get: function (path) {
            return object.value(scope, path);
        }
    };

    console.log(expression.parse(value));

    node.removeAttribute(nodeName);

    if (directive) {
        directive.director = director;
        directive.mvvm = mvvm;
        directive.install(node);
        directive.bind(node, watcher.get(director.expression));
        watcher.watch(director.expression, function (newVal, oldVal, operation) {
            directive.update(node, newVal, oldVal, operation);
        });
    }

    return directive.aborted;
};


