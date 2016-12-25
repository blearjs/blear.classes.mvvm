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


var directives = [];

/**
 * 添加数据监视
 * @param directive
 */
exports.add = function (directive) {
    var scope = directive.scope;
    var watcher = directive.watcher = new Watcher(scope);
    directive.get = function () {
        return directive.getter(scope);
    };

    watcher.link(function () {
        if (!exports.target) {
            return;
        }

        var bindingDirective = exports.target;
        // 不能省略
        exports.target = null;

        return bindingDirective.dispath;
    });

    directives.push(directive);
};


/**
 * 启动监视
 */
exports.start = function () {
    array.each(directives, function (index, directive) {
        var desc = directive.desc;
        var scope = directive.scope;
        var getter = directive.getter;
        var node = desc.node;
        var oldVal;

        directive.dispath = function () {
            var newVal = directive.get();

            if (newVal === oldVal) {
                return;
            }

            directive.update(node, newVal, oldVal);
            oldVal = newVal;
        };
        directive.init(node);
        // 第一次取值时传递 directive
        oldVal = getter(scope, monitor, directive);
        directive.bind(node, oldVal);
    });
};


