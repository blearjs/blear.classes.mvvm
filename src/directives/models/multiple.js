/**
 * multiple model
 * @author ydr.me
 * @created 2016年12月25日20:24:47
 */


'use strict';

var event = require('blear.core.event');
var selector = require('blear.core.selector');
var array = require('blear.utils.array');
var time = require('blear.utils.time');

var arrFlow = require('../../utils/array-flow');
var varible = require('../../utils/varible');
var configs = require('../../configs');

var selecting = varible();
var getOptionVal = function (el) {
    return el.value || el.textContent;
};

exports.init = function (directive, node, newVal) {
    var vm = directive.vm;

    event.on(vm.el, 'change', node, directive.listener = function (ev) {
        vm[selecting] = node;
        var children = selector.children(node);
        array.each(children, function (index, optionEl) {
            var oldVal = directive.get();
            var optionVal = getOptionVal(optionEl);

            if (optionEl.selected) {
                arrFlow.set(oldVal, optionVal);
            } else {
                arrFlow.rm(oldVal, optionVal);
            }
        });
        time.nextTick(function () {
            vm[selecting] = null;
        });
    });
};

exports.update = function (directive, node, newVal) {
    if (directive.vm[selecting] === node) {
        return;
    }

    var children = selector.children(node);
    array.each(children, function (index, optionEl) {
        var optionVal = getOptionVal(optionEl);
        optionEl.selected = arrFlow.fd(newVal, optionVal) > -1;
    });
};


