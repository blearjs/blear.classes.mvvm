/**
 * 数组流动（不严格）
 * @author ydr.me
 * @created 2016-12-25 19:54
 */


'use strict';

var array = require('blear.utils.array');

var toString = function (str) {
    return str === null || str === undefined ? '' : str + '';
};

var isSimilar = function (a, b) {
    return toString(a) === toString(b);
};

exports.boo = typeis.Boolean;

var fd = exports.fd = function (arr, val) {
    var foundIndex = -1;

    array.each(arr, function (index, item) {
        if (isSimilar(item, val)) {
            foundIndex = index;
            return false;
        }
    });

    return foundIndex;
};

exports.set = function (arr, val) {
    var foundIndex = fd(arr, val);

    if (foundIndex === -1) {
        arr.push(val);
    }
};

exports.rm = function (arr, val) {
    var foundIndex = fd(arr, val);

    if (foundIndex !== -1) {
        arr.splice(foundIndex, 1);
    }
};

