/**
 * 位置标记
 * @author ydr.me
 * @created 2016-12-21 00:13
 */


'use strict';

var modification = require('blear.core.modification');

var anchorId = 0;


/**
 * 位置标记
 * @param {Node} targetNode
 * @param {String} [name]
 * @returns {Object}
 */
module.exports = function (targetNode, name) {
    name = name || '';
    name = name ? name + '-' : name;

    var anchorNode;

    if (typeof DEBUG !== 'undefined' && DEBUG) {
        anchorNode = modification.create('#comment', name + anchorId++);
    } else {
        anchorNode = modification.create('#text');
    }

    modification.insert(anchorNode, targetNode, 0);
    return anchorNode;
};


