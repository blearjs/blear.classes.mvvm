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
        [
            // random.string(),
            random.string()
        ]
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

var buildArray = function (length) {
    length = length || random.number(1, 5);
    var arr = [];

    while (length--) {
        arr.push(random.string());
    }

    return arr;
};

document.getElementById('pushArray').onclick = function () {
    var index = random.number(0, data.list.length - 1);

    index = 0;
    data.list[index].push.apply(data.list[index], buildArray(1));
    setData();
};

document.getElementById('popArray').onclick = function () {
    var index = random.number(0, data.list.length - 1);
    data.list[index].pop();
    setData();
};

document.getElementById('unshiftArray').onclick = function () {
    var index = random.number(0, data.list.length - 1);
    data.list[index].unshift.apply(data.list[index], buildArray());
    setData();
};

document.getElementById('shiftArray').onclick = function () {
    var index = random.number(0, data.list.length - 1);
    data.list[index].shift();
    setData();
};

document.getElementById('sortArray').onclick = function () {
    var index = random.number(0, data.list.length - 1);
    data.list[index].sort(function () {
        return Math.random() - 0.5;
    });
    setData();
};

document.getElementById('spliceArray').onclick = function () {
    var startIndex = random.number(0, data.list.length - 1);
    var spliceLength = random.number(0, data.list.length - startIndex - 1);
    var insertArray = buildArray();
    var index = random.number(0, data.list.length - 1);
    var args = [].concat([startIndex, spliceLength], insertArray);

    data.list[index].splice.apply(data.list[index], args);
    setData();
};

setData();
