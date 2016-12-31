/**
 * 文件描述
 * @author ydr.me
 * @created 2016-12-31 15:42
 */


'use strict';

var MVVM = require('../src/index');

var data = window.data = {
    list1: [
        // list2
        [
            // list3
            [
                // list4
                [
                    '4-1', '4-2'
                ]
            ]
        ]
    ]
};

var random = require('blear.utils.random');

var buildArray = function (length) {
    random.number(1, length || 3);
    var arr = [];

    while (length--) {
        arr.push(random.string(3, '习近平致信祝贺中国国际电视台开播李克强主持召开国务院常务会议茶话会上强调两大精神强调一个词'));
    }

    return arr;
};

new MVVM({
    el: '#app',
    data: data,
    methods: {
        pushArray: function () {
            data.list1.push([[buildArray()]]);
        }
    }
});

