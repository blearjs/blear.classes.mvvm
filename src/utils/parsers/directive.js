/**
 * 文件描述
 * @author ydr.me
 * @created 2016-12-20 22:22
 */


'use strict';

/**
 * 解析属性节点为指令信息
 * @param {Node} node
 * @param {Node} attr
 * @param {MVVM} mvvm
 */
exports.attr = function (node, attr, mvvm) {
    var nodeName = attr.nodeName;

    if (nodeName[0] !== '@') {
        return null;
    }

    var name = nodeName.slice(1);
    var value = attr.nodeValue;
    var directive = mvvm._directive(name);

    if (directive) {
        mvvm._bind(value, function (newVal) {
            directive.bind(node, newVal);
        });
        mvvm._update(value, function (newVal, oldVal) {
            directive.update(node, newVal, oldVal);
        });
    }
};


