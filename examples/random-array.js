/**
 * 随机字符串（中文）数组
 * @author ydr.me
 * @created 2017-01-01 17:12
 */


'use strict';

var random = require('blear.utils.random');

var rs = require('./random-string');

module.exports = function (length) {
    length = length || 3;
    var max = random.number(1, length);
    var arr = [];
    max = 3;

    while (max--) {
        arr.push(rs(length))
    }

    return arr;
};



