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
var inputing;
var COMPOSITIONSTART_EVENT = 'compositionstart';
var COMPOSITIONEND_EVENT = 'compositionend';
var INPUT_EVENT = 'input';
var COMPOSITIONSTART_LISTENER = varible();
var COMPOSITIONEND_LISTENER = varible();
var INPUT_LISTENER = varible();

exports.init = function (directive) {
    var vm = directive.vm;
    var node = directive.node;
    var el = vm.el;
    var compositionstart = false;

    event.on(el, COMPOSITIONSTART_EVENT, node, directive[COMPOSITIONSTART_LISTENER] = function () {
        /* istanbul ignore next */
        compositionstart = true;
    });

    event.on(el, COMPOSITIONEND_EVENT, node, directive[COMPOSITIONEND_LISTENER] = function () {
        /* istanbul ignore next */
        compositionstart = false;
    });

    event.on(el, INPUT_EVENT, node, directive[INPUT_LISTENER] = function (ev) {
        inputing = node;
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

exports.destroy = function (directive) {
    var el = directive.vm.el;

    clearTimeout(inputTimer);
    inputTimer = null;
    inputing = null;
    event.un(el, COMPOSITIONSTART_EVENT, directive[COMPOSITIONSTART_LISTENER]);
    event.un(el, COMPOSITIONEND_EVENT, directive[COMPOSITIONEND_LISTENER]);
    event.un(el, INPUT_EVENT, directive[INPUT_LISTENER]);
};


