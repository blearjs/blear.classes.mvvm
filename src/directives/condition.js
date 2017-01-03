/**
 * condition 指令，包括 if、else-if、else
 * @author ydr.me
 * @created 2016-12-19 19:01
 */


'use strict';

var attribute = require('blear.core.attribute');
var modification = require('blear.core.modification');

var anchor = require('../utils/anchor');

module.exports = {
    init: function () {
        var the = this;

        the.exp = 'Boolean(' + the.exp + ')';
        // the.tplNode = the.node.cloneNode(true);
        the.childVM = the.childNode = the.childScope = null;
        the.anchor = anchor(the.node, the.name);

        // 如果是 else，则需要向前查找 if、else-if 表达式
        if (the.name === 'else') {
            var expList = [];
            var foundDir = the.prev;

            while (true) {
                if (foundDir.category === 'cond') {
                    expList.unshift(foundDir.exp)
                }

                if (foundDir.name === 'if') {
                    break;
                }

                foundDir = foundDir.prev;
            }

            the.exp = '!Boolean(' + expList.join('||') + ')';
        }
    },
    update: function (node, newVal, oldVal, operation) {
        var the = this;
        var bool = the.get();

        if (bool) {
            modification.insert(node, the.anchor, 3);
        } else {
            modification.remove(node);
        }
    }
};

