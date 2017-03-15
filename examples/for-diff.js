/**
 * 文件描述
 * @author ydr.me
 * @create 2017-03-15 16:40
 * @update 2017-03-15 16:40
 */


'use strict';

var MVVM = require('../src/index');

var data = {
    list: []
};

new MVVM({
    el: '#demo',
    data: data,
    methods: {
        onConcat: function () {
            data.list = data.list.concat(Math.random());
        }
    }
});
