/**
 * model text 指令
 * @author ydr.me
 * @created 2016-12-25 19:36
 */


'use strict';

var event = require('blear.core.event');
var number = require('blear.utils.number');
var time = require('blear.utils.time');

var configs = require('../../configs');
var varible = require('../../utils/varible');

var inputTimer;
var updateTimer;
var inputing;

exports.init = function (directive) {
    var vm = directive.vm;
    var node = directive.node;
    var el = vm.el;
    var compositionstart = false;

    event.on(el, 'compositionstart', node, directive.compositionstart = function () {
        /* istanbul ignore next */
        compositionstart = true;
    });

    event.on(el, 'compositionend', node, directive.compositionend = function () {
        /* istanbul ignore next */
        compositionstart = false;
    });

    event.on(el, 'input', node, directive.listener = function (ev) {
        inputing = node;
        clearTimeout(updateTimer);
        clearTimeout(inputTimer);
        inputTimer = setTimeout(function () {
            /* istanbul ignore next */
            if (compositionstart) {
                return;
            }

            var setVal = node.value;

            if (directive.filters.trim) {
                setVal = setVal.trim();
            }

            if (
                directive.filters.number ||
                directive.modelType === 'number'
            ) {
                if (setVal !== '') {
                    setVal = number.parseFloat(setVal);
                }
            }

            directive.set(setVal);
        }, 1);
    });

    event.on(el, 'change', function () {
        inputing = null;

        var newVal = directive.get();

        if (newVal !== node.value) {
            node.value = newVal;
        }
    });
};

exports.update = function (directive, newVal) {
    var node = directive.node;

    // 如果是当前元素，则取消改变
    if (inputing === node) {
        return;
    }

    // 相同的值重新赋值影响输入体验
    // 但不同的值，相同的输入框是可以的
    // 比如一个回车操作，将输入框清空（后续的提交操作等）
    if (newVal !== node.value) {
        node.value = newVal;
    }
};


