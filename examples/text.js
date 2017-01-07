/**
 * 文件描述
 * @author ydr.me
 * @create 2016-06-27 17:34
 */


'use strict';

var random = require('blear.utils.random');

var MVVM = require('../src/index');

var data = window.data = {
    text1: '<b>1</b>',
    text2: 'heh'
};

new MVVM({
    el: '#app',
    data: data
});

document.getElementById('change1').onclick = function () {
    data.text1 = random.string();
};

document.getElementById('change2').onclick = function () {
    data.text2 = random.string();
};
