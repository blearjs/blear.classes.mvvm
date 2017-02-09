/**
 * checkbox model
 * @author ydr.me
 * @created 2016-12-25 17:43
 */


'use strict';

var typeis = require('blear.utils.typeis');
var event = require('blear.core.event');

var varible = require('../../utils/varible');
var configs = require('../../configs');
var arrFlow = require('../../utils/array-flow');

var CHANGE_EVENT = 'change';
var CHANGE_LISTENER = varible();

exports.init = function (directive, newVal) {
    var node = directive.node;
    var vm = directive.vm;

    event.on(vm.root.el, CHANGE_EVENT, node, directive[CHANGE_LISTENER] = function (ev) {
        var val = directive.get();
        var nodeVal = node.value;

        if (typeis.Boolean(val)) {
            directive.set(!val);
        } else {
            if (node.checked) {
                arrFlow.set(val, nodeVal);
            } else {
                arrFlow.rm(val, nodeVal);
            }
        }
    });
};

exports.update = function (directive, newVal) {
    var node = directive.node;
    var nodeVal = node.value;

    if (typeis.Boolean(newVal)) {
        node.checked = newVal;
    } else {
        node.checked = arrFlow.fd(newVal, nodeVal) > -1;
    }
};

exports.destroy = function (directive) {
    event.un(directive.vm.root.el, CHANGE_EVENT, directive[CHANGE_LISTENER]);
    directive[CHANGE_LISTENER] = null;
};
