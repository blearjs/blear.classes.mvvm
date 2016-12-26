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

var pack = require('./pack');

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

module.exports = pack({
    init: function (node) {
        var the = this;
        var vm = the.vm;
        var eventType = the.name;
        var filters = the.desc.filters;
        var keyCodeMap = {};
        var shouldEqualKeyCode;

        object.each(filters, function (filter) {
            var keyCode = keyCodes[filter];

            if (keyCode) {
                array.reduce(keyCode, function (p, n) {
                    keyCodeMap[n] = true;
                    return p;
                }, keyCodeMap);
                shouldEqualKeyCode = true;
            }
        });

        event.on(vm.el, eventType, node, the.listener = function (ev) {
            var canExec = true;

            if (shouldEqualKeyCode) {
                canExec = false;

                var keyCode = ev.keyCode;

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

        event.un(the.vm, the.type, the.listener);
    }
});

