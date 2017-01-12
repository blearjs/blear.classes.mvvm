/**
 * 位置标记
 * @author ydr.me
 * @created 2016-12-21 00:13
 */


'use strict';

var modification = require('blear.core.modification');


/**
 * 位置标记
 * @param {Node} targetNode
 * @returns {Object}
 */
module.exports = function (targetNode) {
    var anchorNode = modification.create('#text');
    modification.insert(anchorNode, targetNode, 0);
    return anchorNode;
};


