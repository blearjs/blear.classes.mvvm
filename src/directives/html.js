/**
 * html 指令
 * @author ydr.me
 * @created 2016-12-19 19:01
 */


'use strict';

var attribute = require('blear.core.attribute');

var directive = require('./directive');

module.exports = directive({
    update: function (node, newVal, oldVal) {
        attribute.html(node, newVal);
    }
});

