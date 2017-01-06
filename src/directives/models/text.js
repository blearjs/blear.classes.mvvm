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

var inputing = varible();

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
        vm[inputing] = node;
        time.nextTick(function () {
            if (compositionstart) {
                return;
            }

            var setVal = node.value;

            if (directive.filters.number) {
                setVal = number.parseFloat(setVal);
            }

            directive.set(setVal);
        });
    });
};

exports.update = function (directive, newVal) {
    var node = directive.node;
    var vm = directive.vm;

    // 避免当前正在输入的输入框重新赋值影响输入体验
    if (vm[inputing] !== node) {
        node.value = newVal;
    }
};


