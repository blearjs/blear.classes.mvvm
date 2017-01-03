/**
 * cond 指令，包括 if、else-if、else
 * @author ydr.me
 * @created 2016-12-19 19:01
 */


'use strict';

var modification = require('blear.core.modification');

var anchor = require('../utils/anchor');

module.exports = {
    init: function () {
        this.exp = 'Boolean(' + this.exp + ')';
        // this.tplNode = this.node.cloneNode(true);
        this.childVM = this.childNode = this.childScope = null;
        this.anchor = anchor(this.node, this.name);

        debugger;
    },
    update: function (node, newVal, oldVal, operation) {
        var bool = this.get();

        if (bool) {
            modification.insert(node, this.anchor, 3);
        } else {
            modification.remove(node);
        }
    }
};

