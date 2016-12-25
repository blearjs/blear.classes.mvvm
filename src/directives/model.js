/**
 * model 指令
 * @author ydr.me
 * @created 2016-12-19 19:01
 */


'use strict';

var attribute = require('blear.core.attribute');
var event = require('blear.core.event');
var time = require('blear.utils.time');

var pack = require('./pack');
var eventParser = require('../parsers/event');
var varible = require('../utils/varible');
var checkbox = require('./models/checkbox');
var configs = require('../configs');

module.exports = pack({
    init: function (node) {
        var the = this;
        var vm = the.vm;
        var scope = the.scope;
        var el = vm.el;
        var desc = the.desc;
        var modelName = the.modelName = desc.exp;
        var exec = eventParser(modelName + '=' + configs.elementName + '.value;');
        var compositionstart = false;
        var inputType = the.modelType = (node.type || node.tagName).toLowerCase();

        switch (inputType) {
            case 'text':
            case 'password':
            case 'textarea':
                event.on(el, 'compositionstart', node, the.compositionstart = function () {
                    compositionstart = true;
                });

                event.on(el, 'compositionend', node, the.compositionend = function () {
                    compositionstart = false;
                });

                event.on(el, 'input', node, the.listener = function (ev) {
                    var el = this;
                    var _exec = function () {
                        vm.inputingEl = el;
                        exec(el, ev, scope);
                        time.nextTick(function () {
                            vm.inputingEl = null;
                        });
                    };

                    if (compositionstart) {
                        time.nextFrame(_exec);
                    } else {
                        _exec();
                    }
                });
                break;

            case 'checkbox':
                checkbox.init(the, node);
                break;
        }
    },
    update: function (node, newVal, oldVal) {
        var the = this;

        switch (the.modelType) {
            case 'checkbox':
                checkbox.update(the, node, newVal);
                break;

            default:
                if (the.vm.inputingEl !== node) {
                    node.value = newVal;
                }
                break;
        }
    },
    destroy: function () {
        var the = this;

        event.on(el, 'input', the.listener);
        event.on(el, 'compositionstart', the.compositionstart);
        event.on(el, 'compositionend', the.compositionend);
    }
});

