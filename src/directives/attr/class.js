/**
 * class 属性
 * @author ydr.me
 * @created 2016-12-26 16:07
 */


'use strict';

var object = require('blear.utils.object');
var array = require('blear.utils.array');
var attribute = require('blear.core.attribute');

var arrayCompare = require('../../utils/array-compare');

exports.update = function (directive, newVal, oldVal) {
    var node = directive.node;

    object.each(newVal.map, function (key, val) {
        if (val) {
            attribute.addClass(node, key);
        } else {
            attribute.removeClass(node, key);
        }
    });

    var diff = arrayCompare(oldVal.list, newVal.list);

    array.each(diff.insert, function (index, val) {
        attribute.addClass(node, val);
    });

    array.each(diff.remove, function (index, val) {
        attribute.removeClass(node, val);
    });
};


