/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-06 16:56
 */


'use strict';

exports.createDIV = function () {
    var el = document.createElement('div');
    document.body.appendChild(el);
    return el;
};

exports.removeDIV = function (el) {
    document.body.removeChild(el);
};


