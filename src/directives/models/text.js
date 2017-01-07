/**
 * model text 指令
 * @author ydr.me
 * @created 2016-12-25 19:36
 */


'use strict';

var event = require('blear.core.event');
var time = require('blear.utils.time');
var number = require('blear.utils.number');

var configs = require('../../configs');
var varible = require('../../utils/varible');

var timer;

exports.init = function (directive) {
    var vm = directive.vm;
    var node = directive.node;
    var el = vm.el;
    var compositionstart = false;

    event.on(el, 'compositionstart', node, directive.compositionstart = function () {
        compositionstart = true;
    });

    event.on(el, 'compositionend', node, directive.compositionend = function () {
        compositionstart = false;
    });

    event.on(el, 'input', node, directive.listener = function (ev) {
        clearTimeout(timer);
        timer = setTimeout(function () {
            if (compositionstart) {
                return;
            }

            var setVal = node.value;

            if (directive.filters.trim) {
                setVal = setVal.trim();
            }

            if (directive.filters.number) {
                setVal = number.parseFloat(setVal);
            }

            directive.set(setVal);
        }, 1);
    });
};

exports.update = function (directive, newVal) {
    var node = directive.node;

    // 相同的值重新赋值影响输入体验
    // 但不同的值，相同的输入框是可以的
    // 比如一个回车操作，将输入框清空（后续的提交操作等）
    if (newVal !== node.value) {
        node.value = newVal;
    }
};


