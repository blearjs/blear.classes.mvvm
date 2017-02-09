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

var getOptionVal = function (el) {
    return el.value || el.textContent;
};
var changing;
var CHANGE_EVENT = 'change';
var CHANGE_LISTENER = varible();

exports.init = function (directive, newVal) {
    var node = directive.node;
    var vm = directive.vm;

    event.on(vm.root.el, CHANGE_EVENT, node, directive[CHANGE_LISTENER] = function (ev) {
        changing = node;
        var children = selector.children(node);
        array.each(children, function (index, optionEl) {
            var val = directive.get();
            var optionVal = getOptionVal(optionEl);

            if (optionEl.selected) {
                arrFlow.set(val, optionVal);
            } else {
                arrFlow.rm(val, optionVal);
            }
        });
    });
};

exports.update = function (directive, newVal) {
    var node = directive.node;
    var children = selector.children(node);
    var val = directive.get();

    if (changing === node) {
        changing = null;
        return;
    }

    array.each(children, function (index, optionEl) {
        var optionVal = getOptionVal(optionEl);
        optionEl.selected = arrFlow.fd(val, optionVal) > -1;
    });
};

exports.destroy = function (directive) {
    event.un(directive.vm.root.el, CHANGE_EVENT, directive[CHANGE_LISTENER]);
    directive[CHANGE_LISTENER] = null;
};


