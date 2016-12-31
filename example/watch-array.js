/**
 * 文件描述
 * @author ydr.me
 * @create 2016-06-27 17:34
 */


'use strict';

var random = require('blear.utils.random');

var MVVM = require('../src/index');

var data = window.data = {
    arr: [
        [
            [
                '1', '2'
            ]
        ]
    ]
};

new MVVM({
    el: '#app',
    data: data
});

document.getElementById('change0').onclick = function () {
    data.arr = [[[random.string()]]];
};

document.getElementById('change1').onclick = function () {
    data.arr.set(0, [[random.string()]]);
};

document.getElementById('change2').onclick = function () {
    data.arr[0].set(0, [random.string()]);
};

document.getElementById('change3').onclick = function () {
    data.arr[0][0].set(0, random.string());
};

document.getElementById('change4').onclick = function () {
    data.arr[0][0].set(1, random.string());
};