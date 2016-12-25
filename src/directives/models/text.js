/**
 * 文件描述
 * @author ydr.me
 * @created 2016-12-25 19:36
 */


'use strict';

var event = require('blear.core.event');
var time = require('blear.utils.time');

var eventParser = require('../../parsers/event');
var configs = require('../../configs');
var varible = require('../../utils/varible');

var inputingName = varible();

exports.init = function (directive, node) {
    var modelName = directive.modelName;
    var scope = directive.scope;
    var vm = directive.vm;
    var el = vm.el;
    var compositionstart = false;
    var change = eventParser(modelName + '=' + configs.elementName + '.value;');

    event.on(el, 'compositionstart', node, directive.compositionstart = function () {
        compositionstart = true;
    });

    event.on(el, 'compositionend', node, directive.compositionend = function () {
        compositionstart = false;
    });

    event.on(el, 'input', node, directive.listener = function (ev) {
        var el = this;
        var smoothChange = function () {
            vm[inputingName] = el;
            change(el, ev, scope);
            time.nextTick(function () {
                vm.inputingEl = null;
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
    if (directive.vm[inputingName] !== node) {
        node.value = newVal;
    }
};


