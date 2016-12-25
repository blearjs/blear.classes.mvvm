/**
 * 数组流
 * @author ydr.me
 * @created 2016-12-25 19:54
 */


'use strict';

var array = require('blear.utils.array');
var typeis = require('blear.utils.typeis');

var strFlow = require('./string-flow');

exports.boo = typeis.Boolean;

var fd = exports.fd = function (arr, val) {
    var foundIndex = -1;

    array.each(arr, function (index, item) {
        if (strFlow.similar(item, val)) {
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

