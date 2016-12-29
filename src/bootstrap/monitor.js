/**
 * 监视
 * @author ydr.me
 * @created 2016-12-23 16:27
 */


'use strict';

var Watcher = require('../watcher');
var object = require('blear.utils.object');
var array = require('blear.utils.array');

window.monitor = exports;

// 设置当前正在绑定的指令关系
// 因为 JS 是单线程的，一个时刻只可能只有一个指令指向
exports.target = null;

// var directiveGuidMap = {};
// var oldDirective = null;
//
// object.define(exports, 'directive', {
//     get: function () {
//         return oldDirective;
//     },
//     set: function (newDirective) {
//         var guid = newDirective.guid;
//
//         if (directiveGuidMap[guid]) {
//             return;
//         }
//
//         directives.push(newDirective);
//         directiveGuidMap[guid] = newDirective;
//         oldDirective = newDirective;
//     }
// });


/**
 * 添加数据监视
 * @param directive
 * @param data
 */
exports.add = function (directive, data) {
    var watcher = directive.watcher = new Watcher(data);

    watcher.link(function () {
        // 当前没有绑定阶段的监听
        if (!exports.target) {
            return;
        }

        var bindingDirective = exports.target;

        // 不是指令对应的 watcher
        if (bindingDirective.watcher !== watcher) {
            return;
        }

        return bindingDirective.dispath;
    });
};


/**
 * 启动监视
 */
exports.start = function (directives) {
    array.each(directives, function (index, directive) {
        var scope = directive.scope;
        var expFn = directive.expFn;
        var watcher = directive.watcher;
        var node = directive.node;
        var oldVal;

        directive.dispath = function (_newVal, _oldVal, operation) {
            // 新值使用表达式计算
            var newVal = directive.eval();
            directive.update(node, newVal, oldVal, operation);
            oldVal = newVal;
        };
        directive.dispath.directive = directive;

        if (expFn) {
            // 不能省略
            exports.target = null;
            // 第一次取值时传递 directive
            oldVal = expFn(scope, monitor, directive);
            directive.expFn = null;
        }

        watcher.linkEnd();

        directive.bind(node, oldVal);
    });
};


