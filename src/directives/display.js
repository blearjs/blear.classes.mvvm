/**
 * display 指令，包括 show/hide
 * @author ydr.me
 * @created 2017年01月03日18:28:52
 */


'use strict';

var attribute = require('blear.core.attribute');
// var modification = require('blear.core.modification');

// var anchor = require('../utils/anchor');

module.exports = {
    init: function () {
        var the = this;
        the.exp = 'Boolean(' + the.exp + ')';
    },
    update: function (node, newVal, oldVal, signal) {
        var the = this;
        var bool = the.get();

        if (the.name === 'hide') {
            bool = !bool;
        }

        if (bool) {
            attribute.show(node);
        } else {
            attribute.hide(node);
        }
    }
};

