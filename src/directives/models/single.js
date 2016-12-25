/**
 * single model
 * @author ydr.me
 * @created 2016-12-25 19:53
 */


'use strict';

var event = require('blear.core.event');

var strFlow = require('../../utils/string-flow');
var varible = require('../../utils/varible');
var configs = require('../../configs');

exports.init = function (directive, node, newVal) {
    var modelName = directive.modelName;
    var vm = directive.vm;

    event.on(vm.el, 'change', node, directive.listener = function (ev) {
        directive.scope[modelName] = node.value;
    });
};

exports.update = function (directive, node, newVal) {
    if (node.type === 'radio') {
        node.checked = Boolean(strFlow.similar(newVal, node.value));
    } else {
        node.value = newVal;
    }
};


