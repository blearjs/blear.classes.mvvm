/**
 * 生成随机变量
 * @author ydr.me
 * @created 2016-12-23 16:44
 */


'use strict';

var random = require('blear.utils.random');


/**
 * 生成随机变量
 * @param {String} [prefix="_"]
 * @returns {string}
 */
module.exports = function (prefix) {
    return (prefix || '_') + random.guid();
};


