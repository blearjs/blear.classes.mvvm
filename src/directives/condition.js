/**
 * condition 指令，包括 if、else-if、else
 * @author ydr.me
 * @created 2016-12-19 19:01
 */


'use strict';

var attribute = require('blear.core.attribute');
var modification = require('blear.core.modification');

var anchor = require('../utils/anchor');
var Directive = require('../classes/directive');
var booleanStart = 'Boolean(';
var booleanEnd = ')';

module.exports = {
    weight: 100,
    init: function () {
        var the = this;

        the.exp = booleanStart + the.exp + booleanEnd;
        // the.tplNode = the.node.cloneNode(true);
        the.childVM = the.childNode = the.childScope = null;
        the.anchor = anchor(the.node, the.name);

        // 如果是 else、else-if，则需要向前查找 if、else-if 表达式
        if (the.name !== 'if') {
            var expList = [];
            var foundDir = the.prev;

            while (true) {
                if (foundDir.category === 'condition') {
                    expList.unshift('!' + booleanStart + foundDir.exp + booleanEnd)
                }

                if (foundDir.name === 'if') {
                    break;
                }

                foundDir = foundDir.prev;
            }

            var exp = expList.join('&&');

            // if c1
            // else-if c2
            // else-if c3
            // else => !c1 && !c2 && !c3
            if (the.name === 'else') {
                the.exp = exp;
            }
            // if c1
            // else-if c2
            // else-if c3 => !c1 && !c2 && c3
            else {
                the.exp = exp + '&&' + the.exp;
            }
        }
    },
    update: function (node, newVal, oldVal, operation) {
        var the = this;
        var bool = the.response.get();

        if (bool) {
            modification.insert(node, the.anchor, 3);
        } else {
            modification.remove(node);
        }
    }
};

