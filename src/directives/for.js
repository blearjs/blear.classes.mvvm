/**
 * html 指令
 * @author ydr.me
 * @created 2016-12-19 19:01
 */


'use strict';

var modification = require('blear.core.modification');
var array = require('blear.utils.array');
var random = require('blear.utils.random');

var anchor = require('../utils/anchor');
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
    var anchorStart = directive.anchorStart;
    var anchorEnd = directive.anchorEnd;
    var indexName = directive.indexName;
    var aliasName = directive.aliasName;
    var insertTarget;
    var insertPosition;
    var method = operation.method;

    switch (method) {
        case ARRAY_PUSH:
            insertTarget = anchorEnd;
            insertPosition = 0;
            break;

        case ARRAY_UNSHIFT:
            insertTarget = anchorStart;
            insertPosition = 3;
            break;

        case ARRAY_SPLICE:
            insertTarget = childNodeList[index - 1] || anchorStart;
            insertPosition = 3;
            break;
    }

    childScope[indexName] = index;
    childScope[aliasName] = data;
    modification.insert(childNode, insertTarget, insertPosition);
    directive.vm.child(childNode, childScope);

    switch (method) {
        case ARRAY_PUSH:
        case ARRAY_UNSHIFT:
            childScopeList[method](childScope);
            childNodeList[method](childNode);
            break;

        case ARRAY_SPLICE:
            childScopeList[ARRAY_SPLICE](index, 0, childScope);
            childNodeList[ARRAY_SPLICE](index, 0, childNode);
            break;
    }
};

var sortChildScopeListOrder = function (directive) {
    array.each(directive.childScopeList, function (index, scope) {
        scope[directive.indexName] = index;
    });
};

var moveList = function (list, from, to, howMany) {
    var moveList = list.splice(from, howMany);
    moveList.unshift(0);
    moveList.unshift(to);
    list.splice.apply(list, moveList);
};

module.exports = {
    aborted: true,
    init: function () {
        var the = this;
        var arr1 = the.value.split(' in ');
        var arr2 = arr1[0].split(',');
        var node = the.node;

        the.aliasName = arr2.pop().trim();
        the.indexName = (arr2[0] || '$index').trim();
        the.exp = arr1[1].trim();
        the.childScopeList = [];
        the.childNodeList = [];
        the.anchorStart = anchor(node, '@for-start');
        the.anchorEnd = anchor(node, '@for-end');
        the.tplNode = node;
        modification.remove(node);
    },
    update: function (node, newVal, _oldVal, operation) {
        var the = this;
        var childScopeList = the.childScopeList;
        var childNodeList = the.childNodeList;

        if (the.bound) {
            var spliceIndex = operation.spliceIndex;
            var spliceCount = operation.spliceCount;
            var insertValue = operation.insertValue;
            var oldVal = operation.oldVal;

            switch (operation.method) {
                case ARRAY_SORT:
                    var diffs = arrayDiff(oldVal, newVal);
                    array.each(diffs, function (index, diff) {
                        switch (diff.type) {
                            case 'move':
                                var from0 = diff.from;
                                var from1 = diff.from;
                                var to0 = diff.to;
                                var to1 = diff.to;
                                var howMany = diff.howMany;

                                // 计算相对移动
                                array.each(diffs, function (preIndex, preDiff) {
                                    if (preIndex === index) {
                                        return false;
                                    }

                                    var preFrom = preDiff.from;
                                    var preTo = preDiff.to;
                                    var preHowMany = preDiff.howMany;

                                    // oooAooooAooo
                                    // ooooooBooooo
                                    // 如果 A 移动是跨越 B 的，那么就需要计算偏移量了
                                    // 1. B 的右边到 B 的左边
                                    if (preFrom > from0 && preTo < from0) {
                                        from1 += preHowMany;

                                        if (preTo < to0) {
                                            to1 += preHowMany;
                                        }
                                    }
                                    // 2. B 的左边到 B 的右边
                                    if (preFrom < from0 && preTo > from0) {
                                        from1 -= preHowMany;

                                        if (preTo > to0) {
                                            to1 -= preHowMany;
                                        }
                                    }
                                });

                                // 移动节点
                                var nodes = childNodeList.slice(from1, from1 + howMany);
                                var targetNode = childNodeList[to1];
                                array.each(nodes, function (index, node) {
                                    modification.insert(node, targetNode, 0);
                                }, true);

                                // 移动 node、scope、watcher
                                moveList(childNodeList, from1, to1, howMany);
                                moveList(childScopeList, from1, to1, howMany);
                                break;
                        }
                    });
                    sortChildScopeListOrder(the);
                    break;

                default:
                    var removeNodeList = childNodeList.splice(spliceIndex, spliceCount);
                    childScopeList.splice(spliceIndex, spliceCount);

                    while (removeNodeList.length) {
                        modification.remove(removeNodeList.pop());
                    }

                    array.each(insertValue, function (index, data) {
                        buildChildMVVM(the, spliceIndex + index, data, {
                            method: ARRAY_SPLICE
                        });
                    });

                    sortChildScopeListOrder(the);
                    break;
            }
        } else {
            array.each(newVal, function (index, data) {
                buildChildMVVM(the, index, data, {
                    method: ARRAY_PUSH
                });
            });
        }
    }
};

