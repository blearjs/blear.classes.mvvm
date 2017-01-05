/**
 * directive 修饰
 * @author ydr.me
 * @created 2017-01-03 23:23
 */


'use strict';

var expParser = require('../parsers/expression');
var eventParser = require('../parsers/event');

module.exports = function (directive, vm) {
    directive.vm = vm;
    directive.scope = vm.scope;
    directive.init();

    var exp = directive.exp;
    var scope = directive.scope;

    switch (directive.category) {
        case 'event':
            // 表达式解析需要在指令 init 之后
            var executer = directive.executer = eventParser(exp);
            directive.exec = function (el, ev) {
                return executer(scope, el, ev);
            };
            break;

        default:
            if (!directive.empty) {
                // 表达式解析需要在指令 init 之后
                var getter = directive.getter = expParser(exp);
                directive.get = function () {
                    return getter(scope);
                };
            }
            break;
    }
};


