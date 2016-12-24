/**
 * 文件描述
 * @author ydr.me
 * @create 2016-06-27 17:34
 */


'use strict';

var random = require('blear.utils.random');

var MVVM = require('../src/index');

var data = window.data = {
    html: '1',
    list: ['2']
};

new MVVM({
    el: '#app',
    data: data
});

document.getElementById('set1').onclick = function () {
    data.html = random.string();
};

document.getElementById('set2').onclick = function () {
    data.list.set(0, random.string());
};

document.getElementById('set3').onclick = function () {
    data.list.push(random.string());
};
