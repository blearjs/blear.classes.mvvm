/**
 * 一维字符串对象简单比较
 * @author ydr.me
 * @created 2016年12月26日16:55:45
 */


'use strict';

var object = require('blear.utils.object');


/**
 * 比较两个对象
 * @param {Object} before
 * @param {Object} after
 * @returns {{insert: Array, remove: Array}}
 */
module.exports = function (before, after) {
    var insertList = [];
    var removeList = [];

    object.each(before, function (key) {
        if (
            after[key] === null ||
            after[key] === false ||
            after[key] === undefined
        ) {
            removeList.push(key);
        }
    });

    object.each(after, function (key) {
        if (!(key in before)) {
            insertList.push(key);
        }
    });

    return {
        insert: insertList,
        remove: removeList
    };
};


