/**
 * single model
 * @author ydr.me
 * @created 2016-12-25 19:53
 */


'use strict';

var event = require('blear.core.event');
var time = require('blear.utils.time');

var strFlow = require('../../utils/string-flow');
var varible = require('../../utils/varible');
var configs = require('../../configs');

var singling = varible();

exports.init = function (directive, node, newVal) {
    var modelName = directive.modelName;
    var vm = directive.vm;

    event.on(vm.el, 'change', node, directive.listener = function (ev) {
        vm[singling] = node;
        directive.scope[modelName] = node.value;
        time.nextTick(function () {
            vm[singling] = null;
        });
    });
};

exports.update = function (directive, node, newVal) {
    if (directive.vm[singling] === node) {
        return;
    }

    if (node.type === 'radio') {
        node.checked = Boolean(strFlow.similar(newVal, node.value));
    } else {
        node.value = newVal;
    }
};


