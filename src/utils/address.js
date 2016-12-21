/**
 * 文件描述
 * @author ydr.me
 * @created 2016-12-21 00:13
 */


'use strict';

var modification = require('blear.core.modification');

var addressId = 0;


/**
 * 位置标记
 * @param {Node} targetNode
 * @param {String} [name]
 * @returns {Object}
 */
module.exports = function (targetNode, name) {
    name = name || '';
    name = name ? name + '-' : name;
    var addressNode = modification.create('#comment', name + addressId++);
    modification.insert(addressNode, targetNode, 0);
    return addressNode;
};


