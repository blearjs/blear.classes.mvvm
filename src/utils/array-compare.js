/**
 * 一维字符串数组简单比较
 * @author ydr.me
 * @created 2016-12-26 12:46
 */


'use strict';

var array = require('blear.utils.array');


module.exports = function (before, after) {
    var beforeMap = array.reduce(before, function (p, n) {
        p[n] = true;
        return p;
    }, {});
    var afterMap = array.reduce(after, function (p, n) {
        p[n] = true;
        return p;
    }, {});

    var removeList = [];

    array.each(before, function (index, val) {
        if (afterMap[val]) {
            return;
        }

        removeList.push(val);
    });

    var insertList = [];
    array.each(after, function (index, val) {
        if (beforeMap[val]) {
            return;
        }

        insertList.push(val);
    });

    return {
        insert: insertList,
        remove: removeList
    };
};


