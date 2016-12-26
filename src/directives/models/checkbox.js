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

exports.init = function (directive, node, newVal) {
    var vm = directive.vm;
    var el = vm.el;

    event.on(el, 'change', node, directive.listener = function (ev) {
        var val = directive.get();
        var nodeVal = node.value;

        vm[checking] = node;

        if (typeis.Boolean(val)) {
            directive.set(!val);
        } else {
            if (node.checked) {
                arrFlow.set(val, nodeVal);
            } else {
                arrFlow.rm(val, nodeVal);
            }
        }

        time.nextTick(function () {
            vm[checking] = null;
        });
    });
};

exports.update = function (directive, node, newVal) {
    if (directive.vm[checking] === node) {
        return;
    }

    var val = directive.get();
    var nodeVal = node.value;

    if (typeis.Boolean(val)) {
        node.checked = val;
    } else {
        node.checked = arrFlow.fd(val, nodeVal) > -1;
    }
};
