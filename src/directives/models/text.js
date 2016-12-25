/**
 * 文件描述
 * @author ydr.me
 * @created 2016-12-25 19:36
 */


'use strict';

var event = require('blear.core.event');
var time = require('blear.utils.time');

var configs = require('../../configs');
var varible = require('../../utils/varible');

var inputing = varible();

exports.init = function (directive, node) {
    var vm = directive.vm;
    var el = vm.el;
    var compositionstart = false;

    event.on(el, 'compositionstart', node, directive.compositionstart = function () {
        compositionstart = true;
    });

    event.on(el, 'compositionend', node, directive.compositionend = function () {
        compositionstart = false;
    });

    event.on(el, 'input', node, directive.listener = function (ev) {
        var el = this;
        var smoothChange = function () {
            vm[inputing] = el;
            directive.set(node.value);
            time.nextTick(function () {
                vm[inputing] = null;
            });
        };

        if (compositionstart) {
            time.nextFrame(smoothChange);
        } else {
            smoothChange();
        }
    });
};

exports.update = function (directive, node, newVal) {
    // 避免当前正在输入的输入框重新赋值影响输入体验
    if (directive.vm[inputing] !== node) {
        node.value = newVal;
    }
};

