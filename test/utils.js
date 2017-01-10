/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-06 16:56
 */


'use strict';

exports.createDIV = function () {
    var el = document.createElement('div');
    el.style.padding = '10px';
    el.style.border = '1px solid #bdbdbd';
    el.style.background = '#eee';
    document.body.appendChild(el);
    return el;
};

exports.removeDIV = function (el) {
    document.body.removeChild(el);
};

exports.wait = function (next) {
    setTimeout(next, 1);
};


