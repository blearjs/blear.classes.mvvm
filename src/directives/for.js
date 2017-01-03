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
var configs = require('../configs');
var Directive = require('../classes/directive');

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
    var childVMList = directive.childVMList;
    var anchorStart = directive.anchorStart;
    var anchorEnd = directive.anchorEnd;
    var indexName = directive.indexName;
    var aliasName = directive.aliasName;
    var vm = directive.vm;
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

var sortChildScopeListOrder = function (directive) {
    array.each(directive.childScopeList, function (index, scope) {
        scope[directive.indexName] = index;
    });
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
    stop: true,
    init: function () {
        var the = this;
        var node = the.node;
        var arr1 = the.value.split(' in ');
        var arr2 = arr1[0].split(',');

        the.aliasName = arr2.pop().trim().replace(/\)$/, '');
        the.indexName = (arr2[0] || configs.forIndexName).trim().replace(/^\(/, '');
        the.exp = arr1[1].trim();
        the.childScopeList = [];
        the.childNodeList = [];
        the.childVMList = [];
        the.anchorStart = anchor(node, '@for-start');
        the.anchorEnd = anchor(node, '@for-end');
        the.tplNode = node;
        the.weight = Directive.LOOP_WEIGHT;
        modification.remove(node);
    },
    update: function (node, newVal, _oldVal, operation) {
        var the = this;
        var childScopeList = the.childScopeList;
        var childNodeList = the.childNodeList;
        var childVMList = the.childVMList;
        var data = the.get();

        if (the.bound) {
            // 多维数组的问题，VUE 1.x 是有 BUG 的
            // 但这里已经修正，在如下 DOM 结构里：
            // <1 @for="list1 in list0">
            //     <2 @for="list2 in list1">
            //         <3 @for="list3 in list2">
            //             {{list0}}    <= 这里对 list0 的引用，当超过两级数组，新建的数据就对此不会生效
            //             [[[1]]]      <= 第 1 次加的
            //             [[[1, 2]]]   <= 第 2 次加的，新的列表里有两项，但历史数据没有被更新
            //         </3>
            //     </2>
            // </1>
            // 不是同一个数据源 => 取消后续操作
            if (operation.newVal !== newVal) {
                return;
            }

            var oldVal = operation.oldVal;
            var spliceIndex = operation.spliceIndex;
            var spliceCount = operation.spliceCount;
            var insertValue = operation.insertValue;

            // object set 操作
            if (operation.method === 'set') {
                spliceIndex = 0;
                spliceCount = oldVal.length;
                insertValue = operation.newVal;
            }

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
                        }
                    });
                    break;

                default:
                    childScopeList.splice(spliceIndex, spliceCount);
                    childNodeList.splice(spliceIndex, spliceCount);

                    var removeVMList = childVMList.splice(spliceIndex, spliceCount);

                    while (removeVMList.length) {
                        removeVMList.pop().destroy();
                    }

                    array.each(insertValue, function (index, data) {
                        buildChildMVVM(the, spliceIndex + index, data, {
                            method: ARRAY_SPLICE
                        });
                    });
                    break;
            }

            sortChildScopeListOrder(the);
        } else {
            array.each(data, function (index, data) {
                buildChildMVVM(the, index, data, {
                    method: ARRAY_PUSH
                });
            });
        }
    }
};

