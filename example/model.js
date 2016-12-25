/**
 * 文件描述
 * @author ydr.me
 * @create 2016-06-27 17:34
 */


'use strict';

var random = require('blear.utils.random');

var MVVM = require('../src/index');

var data = window.data = {
    text: 'text',
    checkbox: [1],
    checkbox2: true,
    radio: 1,
    select: 222,
    select2: [222, 333]
};

new MVVM({
    el: '#app',
    data: data,
});
