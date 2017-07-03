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

var changing;
var CHANGE_EVENT = 'change';
var CHANGE_LISTENER = varible();

exports.init = function (directive, newVal) {
    var node = directive.node;
    var vm = directive.vm;

    event.on(vm.root.el, CHANGE_EVENT, node, directive[CHANGE_LISTENER] = function (ev) {
        changing = node;
        directive.set(node.value);
    });
};

exports.update = function (directive, newVal) {
    var node = directive.node;
    var val = directive.get();

    if (changing === node) {
        changing = null;
        return;
    }

    if (node.type === 'radio') {
        node.checked = Boolean(strFlow.similar(val, node.value));
    } else {
        node.value = val;
    }
};

exports.destroy = function (directive) {
    event.un(directive.vm.root.el, CHANGE_EVENT, directive[CHANGE_LISTENER]);
    directive[CHANGE_LISTENER] = null;
};


