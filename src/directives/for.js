/**
 * html 指令
 * @author ydr.me
 * @created 2016-12-19 19:01
 */


'use strict';

var modification = require('blear.core.modification');
var array = require('blear.utils.array');
var random = require('blear.utils.random');

var directive = require('./directive');
var compile = require('../utils/compile');
var address = require('../utils/address');
var arrayDiff = require('../utils/array-diff');

var ARRAY_POP = 'pop';
var ARRAY_PUSH = 'push';
var ARRAY_REVERSE = 'reverse';
var ARRAY_SHIFT = 'shift';
var ARRAY_SORT = 'sort';
var ARRAY_UNSHIFT = 'unshift';
var ARRAY_SPLICE = 'splice';

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
        case ARRAY_PUSH:
            insertTarget = endAddress;
            insertPosition = 0;
            break;

        case ARRAY_UNSHIFT:
            insertTarget = startAddress;
            insertPosition = 3;
            break;
    }

    childScope[directive.indexName] = index;
    childScope[directive.aliasName] = data;
    modification.insert(childNode, insertTarget, insertPosition);
    var watcher = compile(childNode, directive.mvvm, childScope);

    switch (operator) {
        case ARRAY_PUSH:
        case ARRAY_UNSHIFT:
            childScopeList[operator](childScope);
            childNodeList[operator](childNode);
            watcherList[operator](watcher);
            break;
    }
};

var sortChildScopeListOrder = function (directive) {
    array.each(directive.childScopeList, function (index, scope) {
        scope[directive.indexName] = index;
    });
};

var moveList = function (list, diff, callback) {
    var nodes = childNodeList.slice(diff.from, diff.from + diff.howMany);
    var targetNode = childNodeList[diff.to];

    array.each(nodes, function (index, node) {
        modification.insert(node, targetNode, 0);
    }, true);
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

            switch (operation.operator) {
                case ARRAY_PUSH:
                    while (operateValue = newVal.shift()) {
                        operateIndex++;
                        buildChildMVVM(the, operateIndex, operateValue, operation);
                    }
                    break;

                case ARRAY_POP:
                    modification.remove(childNodeList.pop());
                    childScopeList.pop();
                    watcherList.pop().destroy();
                    break;

                case ARRAY_UNSHIFT:
                    operateIndex = newVal.length;
                    while (operateValue = newVal.pop()) {
                        operateIndex--;
                        buildChildMVVM(the, operateIndex, operateValue, operation);
                    }
                    sortChildScopeListOrder(the);
                    break;

                case ARRAY_SHIFT:
                    modification.remove(childNodeList.shift());
                    childScopeList.shift();
                    watcherList.shift().destroy();
                    sortChildScopeListOrder(the);
                    break;

                case ARRAY_SORT:
                    console.log(oldVal);
                    console.log(newVal);
                    var diffs = arrayDiff(oldVal, newVal);
                    console.log(diffs);

                    var fromOffset = 0;
                    var toOffset = 0;
                    array.each(diffs, function (index, diff) {
                        switch (diff.type) {
                            // case 'insert':
                            //     array.each(diff.values, function (index, value) {
                            //         var spliceIndex = diff.start + index;
                            //         buildChildMVVM(the, spliceIndex, value, {
                            //             operator: 'splice',
                            //             operateIndex: spliceIndex
                            //         });
                            //     });
                            //     break;

                            case 'move':
                                debugger;
                                var nodes = childNodeList.slice(diff.from, diff.from + diff.howMany);
                                var targetNode = childNodeList[diff.to];

                                array.each(nodes, function (index, node) {
                                    modification.insert(node, targetNode, 0);
                                }, true);
                                break;

                            // case 'remove':
                            //     break;
                        }
                    });
                    sortChildScopeListOrder(the);
                    break;
            }
        } else {
            array.each(data, function (index, data) {
                buildChildMVVM(the, index, data, {
                    operator: ARRAY_PUSH
                });
            });
        }
    }
});

