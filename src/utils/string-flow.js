/**
 * 字符串处理流
 * @author ydr.me
 * @created 2016-12-25 20:03
 */


'use strict';


var toString = exports.to = function (str) {
    return str === null || str === undefined ? '' : str + '';
};


exports.similar = function (a, b) {
    return toString(a).trim() === toString(b).trim();
};


