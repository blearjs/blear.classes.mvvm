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

module.exports = pack({
    init: function (node) {
        var the = this;
        var vm = the.vm;
        var el = vm.el;
        var desc = the.desc;
        var exec = eventParser(desc.exp + '= $el.value;');
        var compositionstart = false;

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
                exec(el, ev, the.scope);
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
    },
    update: function (node, newVal, oldVal) {
        if (this.vm.inputingEl !== node) {
            node.value = newVal;
        }
    },
    destroy: function () {
        var the = this;

        event.on(el, 'input', the.listener);
        event.on(el, 'compositionstart', the.compositionstart);
        event.on(el, 'compositionend', the.compositionend);
    }
});

