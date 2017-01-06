/**
 * checkbox model
 * @author ydr.me
 * @created 2016-12-25 17:43
 */


'use strict';

var typeis = require('blear.utils.typeis');
var time = require('blear.utils.time');
var event = require('blear.core.event');

var varible = require('../../utils/varible');
var configs = require('../../configs');
var arrFlow = require('../../utils/array-flow');

var checking = varible();

exports.init = function (directive, newVal) {
    var node = directive.node;
    var vm = directive.vm;
    var el = vm.el;

    event.on(el, 'change', node, directive.listener = function (ev) {
        var val = directive.response.get();
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
