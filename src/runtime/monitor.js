/**
 * 监视
 * @author ydr.me
 * @created 2016-12-23 16:27
 */


'use strict';

var object = require('blear.utils.object');
var array = require('blear.utils.array');


// 设置当前正在绑定的指令关系
// 因为 JS 是单线程的，一个时刻只可能只有一个指令指向
var bindingDirective = null;

var directives = [];
var directiveGuidMap = {};
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
 * 添加监视，将编译好的指令放置在监视列表里
 * @param directive
 */
exports.push = function (directive) {
    var guid = directive.guid;

    if (directiveGuidMap[guid]) {
        return;
    }

    new Watcher(directive.scope, {
        inject: function () {
            bindingDirective = directive;

            if (!directive) {
                return;
            }

            directive.watchers.push(this);
            return function (newVal, oldVal, operation) {
                directive.dispatch(newVal, oldVal, operation);
            };
        }
    });

    directives.push(directive);
    directiveGuidMap[guid] = directive;
};


/**
 * 启动监视
 */
exports.start = function () {
    array.each(directives, function (index, directive) {
        var desc = directive.desc;
        var node = desc.node;
        var getter = directive.getter;

        directive.install(node);
        exports.directive = directive;
        directive.bind(node, getter(directive.scope));
    });
};
