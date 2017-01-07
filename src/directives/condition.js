/**
 * condition 指令，包括 if、else-if、else
 * @author ydr.me
 * @created 2016-12-19 19:01
 */


'use strict';

var attribute = require('blear.core.attribute');
var modification = require('blear.core.modification');

var anchor = require('../utils/anchor');
var booleanStart = 'Boolean(';
var booleanEnd = ')';

module.exports = {
    weight: 100,
    stop: true,
    compiled: false,
    init: function () {
        var the = this;

        the.exp = booleanStart + the.exp + booleanEnd;
        the.childVM = the.childNode = the.childScope = null;
        the.anchor = anchor(the.node, the.name);

        // 如果是 else、else-if，则需要向前
        // 查找 if、else-if 表达式
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
    update: function (node, newVal, oldVal, signal) {
        var the = this;
        var bool = the.get();

        // 1、必须先操作 DOM
        if (bool) {
            modification.insert(node, the.anchor, 3);
        } else {
            modification.remove(node);
        }

        // 2、然后再进行懒编译
        // 因为有 @for 指令，会将原始节点进行缓存，
        // 如果一开始该节点不再 DOM 里，则后续的
        // 操作都不在 DOM 里了
        if (!the.compiled && bool) {
            the.compiled = true;
            the.vm.compile(node);
        }
    }
};

