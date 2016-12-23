/**
 * 文件描述
 * @author ydr.me
 * @create 2016-11-12 17:25
 */


'use strict';

var array = require('blear.utils.array');
var Watcher = require('blear.classes.watcher');

var directiveParser = require('../parsers/directive');
var monitor = require('../utils/monitor');

var compileAttrs = function (node, mvvm, scope, watcher) {
    var attrs = array.from(node.attributes);
    var aborted = false;

    array.each(attrs, function (index, attr) {
        aborted = directiveParser.attr(node, attr, mvvm, scope, watcher);
    });

    return aborted;
};

var compileElement = function (node, mvvm, scope, watcher) {
    // 属性指令中止遍历
    if (compileAttrs(node, mvvm, scope, watcher)) {
        return;
    }

    var childNodes = array.from(node.childNodes);

    array.each(childNodes, function (index, childNode) {
        compileNode(childNode, mvvm, scope, watcher);
    });
};

var compileText = function (node, mvvm, scope, watcher) {

};

var compileNode = function (node, mvvm, scope, watcher) {
    switch (node.nodeType) {
        case 1:
        case 11:
            compileElement(node, mvvm, scope, watcher);
            break;

        case 3:
            compileText(node, mvvm, scope, watcher);
            break;
    }
};

module.exports = function (rootEl, mvvm, scope) {
    var watcher = new Watcher(scope, {
        inject: function () {
            // 获取到当前正在获取的值的指令
            // 因为 JS 是单线程的，一个时刻只可能只有一个指令访问
            var directive = monitor.directive;
            monitor.directive = null;

            if (!directive) {
                return;
            }

            return function (newVal, oldVal, operation) {
                directive.dispatch(newVal, oldVal, operation);
            };
        }
    });
    compileNode(rootEl, mvvm, scope, watcher);
    return watcher;
};

