/**
 * on 指令
 * @author ydr.me
 * @created 2016-12-19 19:01
 *
 * @example
 * `@click="onClick"`
 * `@click="onClick()"`
 * `@click="onClick($event)"`
 * `@click="onClick(123)"`
 * `@click.prevent="onClick"` prevent default
 * `@click.stop="onClick"` stop propagation
 * `@click.false="onClick"` return false
 * `@click.enter="onClick"` 在 enter 时执行
 * `@click.enter.false="onClick"` 在 enter 时执行，并且 return false
 */


'use strict';

var event = require('blear.core.event');
var object = require('blear.utils.object');
var array = require('blear.utils.array');

// keyCode aliases
var keyCodes = {
    esc: [27],
    tab: [9],
    enter: [13],
    space: [32],
    'delete': [8, 46],
    up: [38],
    left: [37],
    right: [39],
    down: [40]
};

module.exports = {
    init: function () {
        var the = this;
        var node = the.node;
        var vm = the.vm;
        var eventType = the.name;
        var filters = the.filters;
        var keyCodeMap = {};
        var shouldEqualKeyCode;

        object.each(filters, function (filter) {
            var keyCode = keyCodes[filter];

            if (keyCode) {
                array.reduce(keyCode, function (p, n) {
                    p[n] = true;
                    return p;
                }, keyCodeMap);
                shouldEqualKeyCode = true;
            }
        });

        event.on(vm.el, the.eventType = eventType, node, the.listener = function (ev) {
            var canExec = true;

            if (shouldEqualKeyCode) {
                canExec = false;

                // for 遍历对象，其键会转换为字符串，
                // 因此这里也转换为字符串以作全等比较
                var keyCode = ev.keyCode + '';

                object.each(keyCodeMap, function (_keyCode) {
                    if (_keyCode === keyCode) {
                        canExec = true;
                        return false;
                    }
                });
            }

            if (!canExec) {
                return;
            }

            var ret = the.exec(this, ev);

            if (filters['false']) {
                return false;
            }

            if (filters.prevent) {
                ev.preventDefault();
            }

            if (filters.stop) {
                ev.stopPropagation();
            }

            return ret;
        });
    },

    destroy: function () {
        var the = this;

        event.un(the.vm, the.eventType, the.listener);
    }
};

