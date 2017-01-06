/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-06 16:56
 */


'use strict';

var id = function () {
    return 'r' + Math.random().toString(16).slice(2);
};

exports.createDIV = function () {
    var el = document.createElement('div');
    el.id = id();
    document.body.appendChild(el);
    return el;
};

exports.removeDIV = function (el) {
    document.body.removeChild(el);
};


