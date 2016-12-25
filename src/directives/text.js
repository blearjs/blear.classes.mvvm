/**
 * text 指令
 * @author ydr.me
 * @created 2016-12-19 19:01
 */


'use strict';

var attribute = require('blear.core.attribute');

var pack = require('./pack');

module.exports = pack({
    update: function (node, newVal, oldVal) {
        debugger;
        attribute.text(node, newVal);
    }
});

