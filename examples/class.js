/**
 * 文件描述
 * @author ydr.me
 * @create 2016-06-27 17:34
 */


'use strict';

var random = require('blear.utils.random');

var MVVM = require('../src/index');

var data = window.data = {
    blueOrRed: 'red',
    alignRight: false
};

new MVVM({
    el: '#app',
    data: data
});