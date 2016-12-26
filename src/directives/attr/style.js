/**
 * 样式指令
 * @author ydr.me
 * @created 2016-12-26 16:51
 */


'use strict';

var attribute = require('blear.core.attribute');
var array = require('blear.utils.array');

var objectCompare = require('../../utils/object-compare');


exports.update = function (directive, newVal, oldVal) {
    var node = directive.node;
    var newMap = newVal.map;
    var diff = objectCompare(oldVal.map, newMap);

    array.each(diff.insert, function (index, key) {
        attribute.style(node, key, newMap[key]);
    });

    array.each(diff.remove, function (index, key) {
        attribute.style(node, key, '');
    });
};



