/**
 * 文件描述
 * @author ydr.me
 * @created 2016-12-31 15:42
 */


'use strict';

var MVVM = require('../src/index');
var rs = require('./random-string');

var data = window.data = {
    list: [

    ]
};

var random = require('blear.utils.random');

new MVVM({
    el: '#app',
    data: data,
    methods: {
        pushArray: function () {
            data.list.push(rs());
            data.list.push(rs());
            data.list.push(rs());
        },
        setArray: function () {
            data.list = [rs(), rs(), rs(), rs()];
            data.list = [rs(), rs(), rs()];
            data.list = [rs(), rs()];
        }
    }
});

