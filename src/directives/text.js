/**
 * text 指令
 * @author ydr.me
 * @created 2016-12-19 19:01
 */


'use strict';

var attribute = require('blear.core.attribute');

var stringFlow = require('../utils/string-flow');

module.exports = {
    update: function (node, newVal, oldVal) {
        attribute.text(node, stringFlow.to(newVal));
    }
};

