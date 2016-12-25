/**
 * on 指令
 * @author ydr.me
 * @created 2016-12-19 19:01
 */


'use strict';

var attribute = require('blear.core.attribute');
var event = require('blear.core.event');

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
    bind: function (node, newVal) {

    },
    update: function (node, newVal, oldVal) {
        attribute.text(node, newVal);
    }
});

