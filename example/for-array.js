/**
 * 文件描述
 * @author ydr.me
 * @created 2016-12-31 15:42
 */


'use strict';

var MVVM = require('../src/index');
var rs = require('./random-string');

var data = window.data = {
    list0: [
        // list1
        [

        ]
    ]
};


var random = require('blear.utils.random');

new MVVM({
    el: '#app',
    data: data,
    methods: {
        pushArray: function () {
            data.list0[0].push(rs());
        },
        popArray: function () {
            data.list0[0].pop();
        }
    }
});

