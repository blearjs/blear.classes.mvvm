/**
 * 文件描述
 * @author ydr.me
 * @create 2017-03-15 16:40
 * @update 2017-03-15 16:40
 */


'use strict';

var random = require('blear.utils.random');

var MVVM = require('../src/index');
var rs = require('./random-string');

var data = {
    list: []
};

new MVVM({
    el: '#app',
    data: data,
    methods: {
        onConcat: function () {
            data.list = data.list.concat([
                rs(),
                rs()
            ]);
        },
        onPush: function () {
            data.list.push(rs(), rs());
        },
        onUnshift: function () {
            data.list.unshift(rs(), rs());
        },
        onSort: function () {
            data.list.sort(function (a, b) {
                return Math.random() - 0.5;
            });
        }
    }
});
