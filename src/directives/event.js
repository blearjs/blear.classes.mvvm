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

// @ref https://en.wikipedia.org/wiki/DOM_events#Events
var doNotBubbleEvents = 'load unload scroll blur focus loadstart progress error abort loadend'.split(' ');
doNotBubbleEvents = array.reduce(doNotBubbleEvents, function (p, n) {
    p[n] = 1;
    return p;
}, {});

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

        the.eventType = eventType;

        var listener = the.listener = function (ev) {
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

            var ret = the.get(this, ev);

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
        };

        // 不同冒泡的事件不代理 || 需要 stop 事件
        if (doNotBubbleEvents[eventType] || filters.stop || filters['false']) {
            event.on(node, eventType, listener);
        } else {
            event.on(vm.el, eventType, node, listener);
        }
    },

    destroy: function () {
        var the = this;

        event.un(the.vm.el, the.eventType, the.listener);
        event.un(the.node, the.eventType, the.listener);
    }
};

