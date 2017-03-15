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
            var len = random.number(1, 10);
            data.list = data.list.concat([
                rs(len)
            ]);
        },
        onPush: function () {
            var len = random.number(1, 10);
            data.list.push(rs(len));
        },
        onUnshift: function () {
            var len = random.number(1, 10);
            data.list.unshift(rs(len));
        },
        onSort: function () {
            data.list.sort(function (a, b) {
                return Math.random() - 0.5;
            });
        },
        onReset: function () {
            var len = random.number(1, 10);
            data.list = [
                rs(len),
                rs(len),
                rs(len)
            ];
        }
    }
});
