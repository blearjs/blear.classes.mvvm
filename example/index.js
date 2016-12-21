/**
 * 文件描述
 * @author ydr.me
 * @create 2016-06-27 17:34
 */


'use strict';

var MVVM = require('../src/index');

var dataEl = document.getElementById('data');
var templateEl = document.getElementById('template');
var appEl = document.getElementById('app');

var data = window.data = {
    list: [
        '<b>你好</b>',
        '<i>呵呵</i>'
    ]
};

dataEl.textContent = JSON.stringify(data, null, 4);
templateEl.textContent = appEl.outerHTML;

new MVVM({
    el: '#app',
    data: data
});


