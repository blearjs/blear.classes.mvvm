/**
 * html 指令
 * @author ydr.me
 * @created 2016-12-19 19:01
 */


'use strict';

var modification = require('blear.core.modification');
var array = require('blear.utils.array');

var directive = require('./directive');
var compile = require('../utils/compile');
var address = require('../utils/address');

var buildChildMVVM = function (directive, index, data, operation) {
    // 以 parentScope 创建一个实例，这个实例属性是空的，但原型指向 parentScope
    // 此时的 childScope 可以访问 parentScope 的属性
    var childScope = Object.create(directive.scope);
    var childNode = directive.tplNode.cloneNode(true);
    var childScopeList = directive.childScopeList;
    var childNodeList = directive.childNodeList;
    var watcherList = directive.watcherList;
    var startAddress = directive.startAddress;
    var endAddress = directive.endAddress;
    var insertTarget;
    var insertPosition;
    var operator = operation.operator;

    switch (operator) {
        case 'push':
        default:
            insertTarget = endAddress;
            insertPosition = 0;
            break;

        case 'unshift':
            insertTarget = startAddress;
            insertPosition = 3;
            break;
    }

    childScope[directive.indexName] = index;
    childScope[directive.aliasName] = data;
    modification.insert(childNode, insertTarget, insertPosition);
    var watcher = compile(childNode, directive.mvvm, childScope);

    switch (operator) {
        case 'push':
        case 'unshift':
        default:
            childScopeList[operator](childScope);
            childNodeList[operator](childNode);
            watcherList[operator](watcher);
            break;
    }
};

module.exports = directive({
    aborted: true,
    install: function (node) {
        var the = this;
        var director = the.director;
        var arr1 = director.value.split(' in ');
        var arr2 = arr1[0].split(',');

        the.aliasName = arr2.pop().trim();
        the.indexName = (arr2[0] || '$index').trim();
        director.expression = the.expression = arr1[1].trim();
        the.scope = director.scope;
        the.childScopeList = [];
        the.childNodeList = [];
        the.watcherList = [];
        the.startAddress = address(node, '@for-start');
        the.endAddress = address(node, '@for-end');
        the.tplNode = node;
        modification.remove(node);
    },
    update: function (node, newVal, oldVal, operation) {
        var the = this;
        var director = the.director;
        var expression = the.expression;
        var indexName = the.indexName;
        var childScopeList = the.childScopeList;
        var childNodeList = the.childNodeList;
        var watcherList = the.watcherList;
        var data = director.get(expression);

        if (the.bound) {
            var operateIndex = operation.operateIndex;
            var operateValue;
            debugger;
            switch (operation.operator) {
                case 'push':
                    while (operateValue = newVal.shift()) {
                        operateIndex++;
                        buildChildMVVM(the, operateIndex, operateValue, operation);
                    }
                    break;

                case 'pop':
                    modification.remove(childNodeList.pop());
                    childScopeList.pop();
                    watcherList.pop().destroy();
                    break;

                case 'unshift':
                    operateIndex = newVal.length;
                    array.each(childScopeList, function (index, scope) {
                        scope[indexName] = operateIndex + index;
                    });
                    while (operateValue = newVal.pop()) {
                        operateIndex--;
                        buildChildMVVM(the, operateIndex, operateValue, operation);
                    }
                    break;
            }
        } else {
            array.each(data, function (index, data) {
                buildChildMVVM(the, index, data, {});
            });
        }
    }
});

