/**
 * 文件描述
 * @author ydr.me
 * @create 2016-06-27 17:34
 */


'use strict';

var random = require('blear.utils.random');

var MVVM = require('../src/index');

var dataEl = document.getElementById('data');
var templateEl = document.getElementById('template');
var appEl = document.getElementById('app');

var data = window.data = {
    list: [
        random.string(),
        random.string()
    ]
};

var setData = function () {
    dataEl.textContent = JSON.stringify(data, null, 4);
};

templateEl.textContent = appEl.outerHTML.replace(/^\s{4,8}/mg, '');

new MVVM({
    el: '#app',
    data: data
});

var buildArray = function () {
    var length = random.number(1, 5);
    var arr = [];

    while (length--) {
        arr.push(random.string());
    }

    return arr;
};

document.getElementById('pushArray').onclick = function () {
    data.list.push.apply(data.list, buildArray());
    setData();
};

document.getElementById('popArray').onclick = function () {
    data.list.pop();
    setData();
};

document.getElementById('unshiftArray').onclick = function () {
    data.list.unshift.apply(data.list, buildArray());
    setData();
};

document.getElementById('shiftArray').onclick = function () {
    data.list.shift();
    setData();
};

document.getElementById('sortArray').onclick = function () {
    data.list.sort(function () {
        return Math.random() - 0.5;
    });
    setData();
};

document.getElementById('spliceArray').onclick = function () {
    var startIndex = random.number(0, data.list.length - 1);
    var spliceLength = random.number(0, data.list.length - startIndex - 1);
    var insertArray = buildArray();

    console.log('splice', startIndex, spliceLength, insertArray);
    var args = [].concat([startIndex, spliceLength], insertArray);
    data.list.splice.apply(data.list, args);
    setData();
};

setData();
