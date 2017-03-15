/**
 * html 指令
 * @author ydr.me
 * @created 2016-12-19 19:01
 */


'use strict';

var modification = require('blear.core.modification');
var array = require('blear.utils.array');
var collection = require('blear.utils.collection');
var typeis = require('blear.utils.typeis');
var random = require('blear.utils.random');

var anchor = require('../utils/anchor');
var arrayDiff = require('../utils/array-diff');
var configs = require('../configs');

var ARRAY_POP = 'pop';
var ARRAY_PUSH = 'push';
var ARRAY_REVERSE = 'reverse';
var ARRAY_SHIFT = 'shift';
var ARRAY_SORT = 'sort';
var ARRAY_UNSHIFT = 'unshift';
var ARRAY_SPLICE = 'splice';
var ARRAY_SET = 'set';

var buildChildMVVM = function (directive, index, data, signal) {
    // 以 parentScope 创建一个实例，这个实例属性是空的，但原型指向 parentScope
    // 此时的 childScope 可以访问 parentScope 的属性
    var childScope = Object.create(directive.scope);
    var childNode = directive.tplNode.cloneNode(true);
    var childScopeList = directive.childScopeList;
    var childNodeList = directive.childNodeList;
    var childVMList = directive.childVMList;
    var anchorStart = directive.anchorStart;
    var anchorEnd = directive.anchorEnd;
    var indexName = directive.indexName;
    var keyName = directive.keyName;
    var aliasName = directive.aliasName;
    var vm = directive.vm;
    var insertTarget;
    var insertPosition;
    var method = signal.method;

    switch (method) {
        case ARRAY_PUSH:
            insertTarget = anchorEnd;
            insertPosition = 0;
            break;

        case ARRAY_SPLICE:
            insertTarget = childNodeList[index - 1] || anchorStart;
            insertPosition = 3;
            break;
    }

    childScope[indexName] = index;
    childScope[keyName] = index;
    childScope[aliasName] = data;
    modification.insert(childNode, insertTarget, insertPosition);

    var childVM = vm.child(childNode, childScope, [indexName, aliasName]);

    switch (method) {
        case ARRAY_PUSH:
        case ARRAY_UNSHIFT:
            childScopeList[method](childScope);
            childNodeList[method](childNode);
            childVMList[method](childVM);
            break;

        case ARRAY_SPLICE:
            childScopeList[ARRAY_SPLICE](index, 0, childScope);
            childNodeList[ARRAY_SPLICE](index, 0, childNode);
            childVMList[ARRAY_SPLICE](index, 0, childVM);
            break;
    }
};

var moveList = function (list, from, to, howMany) {
    var args = list.splice(from, howMany);
    // 删除个数
    args.unshift(0);
    // 目标位置
    args.unshift(to);
    list.splice.apply(list, args);
};

module.exports = {
    weight: 10,
    stop: true,
    init: function () {
        var the = this;
        var node = the.node;
        var arr1 = the.value.split(' in ');
        var arr2 = arr1[0].split(',');

        the.aliasName = arr2.pop().trim().replace(/\)$/, '');
        var setKey = (arr2[0] || '').trim().replace(/^\(/, '');
        the.indexName = setKey || configs.forIndexName;
        the.keyName = setKey || configs.forKeyName;
        the.exp = arr1[1].trim();
        the.childScopeList = [];
        the.childNodeList = [];
        the.childVMList = [];
        the.anchorStart = anchor(node);
        the.anchorEnd = anchor(node);
        the.tplNode = node;
        modification.remove(node);
    },
    update: function (node, newVal, oldVal, signal) {
        var the = this;
        var childScopeList = the.childScopeList;
        var childNodeList = the.childNodeList;
        var childVMList = the.childVMList;

        if (the.bound) {
            oldVal = oldVal || signal.oldVal;
            var spliceIndex = signal.spliceIndex;
            var spliceCount = signal.spliceCount;
            var insertValue = signal.insertValue;

            // // object set 操作
            // if (signal.method === 'set') {
            //     spliceIndex = 0;
            //     spliceCount = oldVal.length;
            //     insertValue = newVal;
            // }

            switch (signal.method) {
                case ARRAY_SET:
                case ARRAY_SORT:
                    var diffs = arrayDiff(oldVal, newVal);
                    // @todo 性能优化
                    array.each(diffs, function (index, diff) {
                        switch (diff.type) {
                            case 'move':
                                var from0 = diff.from;
                                var from1 = diff.from;
                                var to0 = diff.to;
                                var to1 = diff.to;
                                var howMany = diff.howMany;

                                // 计算相对移动
                                // array.each(diffs, function (preIndex, preDiff) {
                                //     if (preIndex === index) {
                                //         return false;
                                //     }
                                //
                                //     var preFrom = preDiff.from;
                                //     var preTo = preDiff.to;
                                //     var preHowMany = preDiff.howMany;
                                //
                                //     // oooAooooAooo
                                //     // ooooooBooooo
                                //     // 如果 A 移动是跨越 B 的，那么就需要计算偏移量了
                                //     // 1. B 的右边到 B 的左边
                                //     if (preFrom > from0 && preTo < from0) {
                                //         from1 += preHowMany;
                                //
                                //         if (preTo < to0) {
                                //             to1 += preHowMany;
                                //         }
                                //     }
                                //     // 2. B 的左边到 B 的右边
                                //     if (preFrom < from0 && preTo > from0) {
                                //         from1 -= preHowMany;
                                //
                                //         if (preTo > to0) {
                                //             to1 -= preHowMany;
                                //         }
                                //     }
                                // });

                                // 移动子节点
                                var nodes = childNodeList.slice(from1, from1 + howMany);
                                var targetNode = childNodeList[to1];
                                array.each(nodes, function (index, node) {
                                    modification.insert(node, targetNode, 0);
                                });

                                // 移动子 node、scope、vm
                                moveList(childNodeList, from1, to1, howMany);
                                moveList(childScopeList, from1, to1, howMany);
                                moveList(childVMList, from1, to1, howMany);
                                break;

                            case 'insert':
                                array.each(diff.values, function (index, data) {
                                    buildChildMVVM(the, diff.index + index, data, {
                                        method: ARRAY_SPLICE
                                    });
                                });
                                break;
                        }
                    });
                    break;

                default:
                    childScopeList.splice(spliceIndex, spliceCount);
                    childNodeList.splice(spliceIndex, spliceCount);

                    var removeVMList = childVMList.splice(spliceIndex, spliceCount);

                    while (removeVMList.length) {
                        removeVMList.pop().destroy(true);
                    }

                    array.each(insertValue, function (index, data) {
                        buildChildMVVM(the, spliceIndex + index, data, {
                            method: ARRAY_SPLICE
                        });
                    });
                    break;
            }

            array.each(the.childScopeList, function (index, scope) {
                scope[the.indexName] = index;
            });
        } else {
            collection.each(newVal, function (index, data) {
                buildChildMVVM(the, index, data, {
                    method: ARRAY_PUSH
                });
            });
        }
    }
};

