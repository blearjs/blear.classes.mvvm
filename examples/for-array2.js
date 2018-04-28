/**
 * 文件描述
 * @author ydr.me
 * @created 2016-12-31 15:42
 */


'use strict';

var MVVM = require('../src/index');
var rs = require('./random-string');

var data = window.data = {
    list: []
};

var random = require('blear.utils.random');

new MVVM({
    el: '#app',
    data: data,
    methods: {
        pushArray: function () {
            data.list.push('1' + rs());
            data.list.push('2' + rs());
            data.list.push('3' + rs());
        },
        setArray: function () {
            data.list = ['1' + rs(), '1' + rs(), '1' + rs(), '1' + rs()];
            data.list = ['2' + rs(), '2' + rs(), '2' + rs()];
            data.list = ['3' + rs(), '3' + rs()];
        }
    }
});

